import { headers } from "next/headers";
import { Webhook } from "svix";

import { getDb } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  const body = await request.text();
  const headersList = headers();
  const svixId = headersList.get("svix-id");
  const svixTimestamp = headersList.get("svix-timestamp");
  const svixSignature = headersList.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("Missing CLERK_WEBHOOK_SECRET environment variable");
    return new Response("Missing CLERK_WEBHOOK_SECRET", { status: 500 });
  }

  const wh = new Webhook(webhookSecret);

  let evt;

  try {
    evt = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    });
  } catch (err) {
    console.error("Clerk webhook verification error", err);
    return new Response("Webhook verification failed", { status: 400 });
  }

  const { id, email_addresses, first_name, last_name, image_url, created_at } =
    evt.data || {};

  const eventType = evt.type;

  if (!id) {
    console.error("Missing user id in webhook payload");
    return new Response("Missing user id", { status: 400 });
  }

  try {
    const db = await getDb();

    if (eventType === "user.created") {
      // Store user data in MongoDB on first login
      await db.collection("users").updateOne(
        { clerkId: id },
        {
          $set: {
            clerkId: id,
            email: email_addresses?.[0]?.email_address || null,
            firstName: first_name || null,
            lastName: last_name || null,
            imageUrl: image_url || null,
            createdAt: created_at ? new Date(created_at) : new Date(),
            updatedAt: new Date(),
          },
        },
        { upsert: true }
      );

      console.log("User created in MongoDB:", id);
    } else if (eventType === "user.updated") {
      // Update user data if it changes
      await db.collection("users").updateOne(
        { clerkId: id },
        {
          $set: {
            email: email_addresses?.[0]?.email_address || null,
            firstName: first_name || null,
            lastName: last_name || null,
            imageUrl: image_url || null,
            updatedAt: new Date(),
          },
        }
      );

      console.log("User updated in MongoDB:", id);
    }

    return new Response("ok", { status: 200 });
  } catch (error) {
    // Log detailed error information
    console.error("Clerk webhook MongoDB error:", error);
    console.error("Error details:", {
      message: error.message,
      name: error.name,
      eventType,
      userId: id,
      hasMongoUri: !!process.env.MONGODB_URI,
    });

    // Return 500 but with detailed error message for debugging
    return new Response(
      JSON.stringify({ 
        error: "Webhook processing failed", 
        message: error.message,
        type: error.name || "UnknownError"
      }),
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}

