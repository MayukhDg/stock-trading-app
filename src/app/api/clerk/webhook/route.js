import { headers } from "next/headers";
import { Webhook } from "svix";
import { dbConnect } from "@/lib/db";
import { User } from "@/models/User";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  const body = await request.text();
  const headersList = await headers();
  const svixId = headersList.get("svix-id");
  const svixTimestamp = headersList.get("svix-timestamp");
  const svixSignature = headersList.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    console.error("Missing svix headers");
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
    console.error("Clerk webhook verification error:", err);
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
    // Ensure database connection
    await dbConnect();

    if (eventType === "user.created") {
      // Create or update user in MongoDB using Mongoose
      const userData = {
        clerkId: id,
        email: email_addresses?.[0]?.email_address || null,
        firstName: first_name || null,
        lastName: last_name || null,
        imageUrl: image_url || null,
        createdAt: created_at ? new Date(created_at) : new Date(),
        updatedAt: new Date(),
      };

      const user = await User.findOneAndUpdate(
        { clerkId: id },
        { $set: userData },
        { upsert: true, new: true, runValidators: true }
      );

      console.log("User created in MongoDB:", user.clerkId);
    } else if (eventType === "user.updated") {
      // Update user data if it changes
      const updateData = {
        email: email_addresses?.[0]?.email_address || null,
        firstName: first_name || null,
        lastName: last_name || null,
        imageUrl: image_url || null,
        updatedAt: new Date(),
      };

      const user = await User.findOneAndUpdate(
        { clerkId: id },
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (user) {
        console.log("User updated in MongoDB:", user.clerkId);
      } else {
        console.warn("User not found for update:", id);
      }
    } else if (eventType === "user.deleted") {
      // Handle user deletion
      const deletedUser = await User.findOneAndDelete({ clerkId: id });
      
      if (deletedUser) {
        console.log("User deleted from MongoDB:", deletedUser.clerkId);
      } else {
        console.warn("User not found for deletion:", id);
      }
    }

    return new Response("ok", { status: 200 });
  } catch (error) {
    console.error("Clerk webhook MongoDB error:", error);
    console.error("Error details:", {
      message: error.message,
      name: error.name,
      stack: error.stack,
      eventType,
      userId: id,
      hasMongoUri: !!process.env.MONGODB_URI,
    });

    return new Response(
      JSON.stringify({
        error: "Webhook processing failed",
        message: error.message,
        type: error.name || "UnknownError",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}