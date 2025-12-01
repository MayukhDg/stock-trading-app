import { headers } from "next/headers";
import { dbConnect } from "@/lib/db";
import { Order, Subscription } from "@/models";
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
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );

    await dbConnect();

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const clerkUserId = session.metadata?.clerkUserId;

        // Store order in MongoDB using Mongoose
        await Order.create({
          stripeSessionId: session.id,
          stripeCustomerId: session.customer,
          clerkUserId: clerkUserId,
          amountTotal: session.amount_total,
          currency: session.currency,
          paymentStatus: session.payment_status,
          subscriptionId: session.subscription || null,
          createdAt: new Date(),
        });

        // If there's a subscription, store/update subscription info
        if (session.subscription && clerkUserId) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription
          );

          await Subscription.findOneAndUpdate(
            { clerkUserId: clerkUserId },
            {
              $set: {
                clerkUserId: clerkUserId,
                stripeSubscriptionId: subscription.id,
                stripeCustomerId: subscription.customer,
                status: subscription.status,
                currentPeriodStart: new Date(
                  subscription.current_period_start * 1000
                ),
                currentPeriodEnd: new Date(
                  subscription.current_period_end * 1000
                ),
                cancelAtPeriodEnd: subscription.cancel_at_period_end,
                updatedAt: new Date(),
              },
            },
            { upsert: true, new: true }
          );
        }

        console.log("Order stored in MongoDB:", session.id);
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        // Find the user by Stripe customer ID
        const order = await Order.findOne({ stripeCustomerId: customerId });

        if (order && order.clerkUserId) {
          await Subscription.findOneAndUpdate(
            { clerkUserId: order.clerkUserId },
            {
              $set: {
                status: subscription.status,
                currentPeriodStart: new Date(
                  subscription.current_period_start * 1000
                ),
                currentPeriodEnd: new Date(
                  subscription.current_period_end * 1000
                ),
                cancelAtPeriodEnd: subscription.cancel_at_period_end,
                updatedAt: new Date(),
              },
            }
          );

          console.log(
            "Subscription updated in MongoDB:",
            subscription.id,
            order.clerkUserId
          );
        }
        break;
      }
      default:
        break;
    }

    return new Response("ok");
  } catch (error) {
    console.error("Stripe webhook error", error);
    return new Response("Webhook error", { status: 400 });
  }
}