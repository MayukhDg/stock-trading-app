import { currentUser } from "@clerk/nextjs/server";
import { z } from "zod";
import { dbConnect } from "@/lib/db";
import { BrokerLink } from "@/models";
import { exchangeRequestToken } from "@/lib/zerodha";

const schema = z.object({
  requestToken: z.string().min(10),
});

export async function POST(request) {
  const user = await currentUser();
  const userId = user?.id;
  
  if (!userId) {
    return Response.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const formData = await request.formData();
  const rawToken = formData.get("requestToken");
  
  // Clean the token thoroughly
  const cleanedToken = (rawToken || "").toString().trim().replace(/\s+/g, '');
  
  const parsed = schema.safeParse({
    requestToken: cleanedToken,
  });

  if (!parsed.success) {
    console.error("Token validation failed:", parsed.error);
    return Response.json({ 
      error: "Invalid request token format",
      details: parsed.error.errors 
    }, { status: 400 });
  }

  try {
    console.log("Attempting to exchange request token for user:", userId);
    
    const tokenPayload = await exchangeRequestToken({ 
      requestToken: parsed.data.requestToken 
    });
    
    if (!tokenPayload?.data?.access_token) {
      throw new Error("Invalid token response from Zerodha");
    }

    await dbConnect();

    const brokerLink = await BrokerLink.findOneAndUpdate(
      { userId },
      {
        $set: {
          userId,
          accessToken: tokenPayload.data.access_token,
          publicToken: tokenPayload.data.public_token || null,
          refreshToken: tokenPayload.data.refresh_token || null,
          updatedAt: new Date(),
        },
      },
      { upsert: true, new: true }
    );

    console.log("Successfully linked Zerodha for user:", userId);

    return Response.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?linked=success`,
      302
    );
  } catch (error) {
    console.error("Zerodha link error:", error);
    const msg = String(error?.message || error);
    
    // Check for specific error types
    if (/invalid|expired|TokenException/i.test(msg)) {
      return Response.json({ 
        error: "token_expired", 
        action: "/api/zerodha/start", 
        detail: msg 
      }, { status: 400 });
    }

    if (msg.includes("checksum")) {
      return Response.json({ 
        error: "invalid_credentials",
        detail: "API credentials validation failed. Please check your ZERODHA_API_KEY and ZERODHA_API_SECRET environment variables.",
        hint: "Ensure there are no extra spaces or special characters in your .env file"
      }, { status: 500 });
    }

    return Response.json({ 
      error: "Failed to link Zerodha", 
      detail: msg 
    }, { status: 500 });
  }
}

export async function GET(request) {
  const user = await currentUser();
  const userId = user?.id;
  const url = new URL(request.url);
  const rawToken = url.searchParams.get("request_token") || url.searchParams.get("requestToken");
  
  // Clean the token
  const requestToken = (rawToken || "").toString().trim().replace(/\s+/g, '');

  // Handle unauthenticated users
  if (!userId) {
    if (requestToken) {
      const clientCallback = `${process.env.NEXT_PUBLIC_APP_URL}/zerodha/callback?request_token=${encodeURIComponent(requestToken)}`;
      return Response.redirect(clientCallback, 302);
    }
    return Response.json({ error: "Unauthenticated" }, { status: 401 });
  }

  if (!requestToken) {
    return Response.json({ error: "Missing request_token" }, { status: 400 });
  }

  try {
    console.log("GET: Attempting to exchange request token for user:", userId);
    
    const tokenPayload = await exchangeRequestToken({ requestToken });
    
    if (!tokenPayload?.data?.access_token) {
      throw new Error("Invalid token response from Zerodha");
    }

    await dbConnect();

    await BrokerLink.findOneAndUpdate(
      { userId },
      {
        $set: {
          userId,
          accessToken: tokenPayload.data.access_token,
          publicToken: tokenPayload.data.public_token || null,
          refreshToken: tokenPayload.data.refresh_token || null,
          updatedAt: new Date(),
        },
      },
      { upsert: true, new: true }
    );

    console.log("GET: Successfully linked Zerodha for user:", userId);

    return Response.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?linked=success`,
      302
    );
  } catch (error) {
    console.error("GET: Zerodha link error:", error);
    const msg = String(error?.message || error);
    
    if (/invalid|expired|TokenException/i.test(msg)) {
      // Redirect to restart the flow
      return Response.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=token_expired`,
        302
      );
    }

    if (msg.includes("checksum")) {
      return Response.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=invalid_credentials`,
        302
      );
    }

    return Response.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=link_failed`,
      302
    );
  }
}