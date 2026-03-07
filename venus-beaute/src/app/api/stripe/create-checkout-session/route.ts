import { NextResponse } from "next/server";
import { products } from "@/data/products";
import { stripe } from "@/lib/stripe";

export async function POST() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const lineItems = products.map((product) => ({
      quantity: 1,
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
      metadata: {
        source: "venus-beaute-web",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe create-checkout-session error", error);
    return NextResponse.json({ error: "Impossible de créer la session Stripe." }, { status: 500 });
  }
}
