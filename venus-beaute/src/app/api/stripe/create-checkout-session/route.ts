import { NextRequest, NextResponse } from "next/server";
import { products } from "@/data/products";
import { stripe } from "@/lib/stripe";

type CartItemInput = {
  slug: string;
  quantity: number;
};

export async function POST(req: NextRequest) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const body = (await req.json().catch(() => ({}))) as {
      slug?: string;
      quantity?: number;
      items?: CartItemInput[];
    };

    let requestedItems: CartItemInput[] = [];

    if (Array.isArray(body.items) && body.items.length > 0) {
      requestedItems = body.items;
    } else {
      requestedItems = [{ slug: body.slug ?? products[0].slug, quantity: body.quantity ?? 1 }];
    }

    const normalized = requestedItems
      .map((item) => {
        const product = products.find((p) => p.slug === item.slug);
        const quantity = Math.max(1, Math.min(20, Number(item.quantity || 1)));
        if (!product) return null;
        return { product, quantity };
      })
      .filter((item): item is { product: (typeof products)[number]; quantity: number } => item !== null);

    if (normalized.length === 0) {
      return NextResponse.json({ error: "Panier vide ou invalide." }, { status: 400 });
    }

    const lineItems = normalized.map(({ product, quantity }) => ({
      quantity,
      price_data: {
        currency: "eur",
        unit_amount: Math.round(product.price * 100),
        product_data: {
          name: product.name,
          description: product.shortDescription,
          images: [product.image],
          metadata: {
            productId: product.id,
            slug: product.slug,
          },
        },
      },
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout/cancel`,
      customer_creation: "always",
      allow_promotion_codes: true,
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["FR"],
      },
      shipping_options: [
        {
          shipping_rate: "shr_1T8nET62KsXIqxXvf2Qbnh9R",
        },
        {
          shipping_rate: "shr_1T8nPC62KsXIqxXv3fQ0pigS",
        },
      ],
      metadata: {
        source: "venus-beaute-web",
        cartSize: String(normalized.length),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe create-checkout-session error", error);
    return NextResponse.json({ error: "Impossible de créer la session Stripe." }, { status: 500 });
  }
}
