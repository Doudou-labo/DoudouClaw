import { NextRequest, NextResponse } from "next/server";
import { products } from "@/data/products";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const body = (await req.json().catch(() => ({}))) as { slug?: string; quantity?: number };

    const selectedProduct = products.find((p) => p.slug === body.slug) ?? products[0];
    const quantity = Math.max(1, Math.min(20, Number(body.quantity ?? 1)));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          quantity,
          price_data: {
            currency: "eur",
            unit_amount: Math.round(selectedProduct.price * 100),
            product_data: {
              name: selectedProduct.name,
              description: selectedProduct.shortDescription,
              images: [selectedProduct.image],
              metadata: {
                productId: selectedProduct.id,
                slug: selectedProduct.slug,
              },
            },
          },
        },
      ],
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout/cancel`,
      customer_creation: "always",
      allow_promotion_codes: true,
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["FR"],
      },
      metadata: {
        source: "venus-beaute-web",
        slug: selectedProduct.slug,
        quantity: String(quantity),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe create-checkout-session error", error);
    return NextResponse.json({ error: "Impossible de créer la session Stripe." }, { status: 500 });
  }
}
