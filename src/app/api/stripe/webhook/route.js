import { headers } from "next/headers";

import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  const body = await request.text();
  const signature = headers().get("stripe-signature");

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || "",
    );

    switch (event.type) {
      case "checkout.session.completed":
        // TODO: persist subscription state in MongoDB via event.data.object
        break;
      default:
        break;
    }

    return new Response("ok");
  } catch (error) {
    console.error("Stripe webhook error", error);
    return new Response("Webhook error", { status: 400 });
  }
}

