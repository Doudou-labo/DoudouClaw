import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const discordWebhook = process.env.DISCORD_ORDERS_WEBHOOK_URL;

async function notifyDiscord(message: string) {
  if (!discordWebhook) return;

  try {
    await fetch(discordWebhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: message }),
    });
  } catch (error) {
    console.error("Discord webhook error", error);
  }
}

export async function POST(req: Request) {
  if (!webhookSecret) {
    return NextResponse.json({ error: "Missing STRIPE_WEBHOOK_SECRET" }, { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  const payload = await req.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    console.error("Stripe webhook signature error", error);
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const amount = session.amount_total ? (session.amount_total / 100).toFixed(2) : "0.00";

    console.log("✅ Commande payée", {
      sessionId: session.id,
      email: session.customer_details?.email,
      amount,
      currency: session.currency,
    });

    await notifyDiscord(
      `🛍️ Nouvelle commande payée !\n` +
        `• Session: ${session.id}\n` +
        `• Client: ${session.customer_details?.email ?? "n/a"}\n` +
        `• Montant: ${amount} ${(session.currency || "eur").toUpperCase()}`
    );
  }

  return NextResponse.json({ received: true });
}
