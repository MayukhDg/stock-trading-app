import { currentUser } from "@clerk/nextjs/server";

import { STRIPE_PRICE_ID, stripe } from "@/lib/stripe";

export async function POST() {
  const user = await currentUser();
  const userId = user?.id;
  const email =
    user?.primaryEmailAddress?.emailAddress ||
    (user?.emailAddresses && user.emailAddresses[0]?.emailAddress) ||
    null;

  if (!userId) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  if (!STRIPE_PRICE_ID) {
    return Response.json(
      { error: "Missing STRIPE_PRICE_ID" },
      { status: 500 },
    );
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: sessionClaims?.email,
      payment_method_types: ["card"],
      line_items: [{ price: STRIPE_PRICE_ID, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscribe?checkout=cancelled`,
      metadata: { clerkUserId: userId },
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error", error);
    return Response.json({ error: "Stripe checkout failed" }, { status: 500 });
  }
}

