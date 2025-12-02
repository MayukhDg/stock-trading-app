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
  const parsed = schema.safeParse({
    requestToken: formData.get("requestToken"),
  });

  if (!parsed.success) {
    return Response.json({ error: "Invalid request token" }, { status: 400 });
  }

  try {
    const tokenPayload = await exchangeRequestToken(parsed.data);
    await dbConnect();

    await BrokerLink.findOneAndUpdate(
      { userId },
      {
        $set: {
          userId,
          accessToken: tokenPayload?.data?.access_token,
          publicToken: tokenPayload?.data?.public_token,
          refreshToken: tokenPayload?.data?.refresh_token,
          updatedAt: new Date(),
        },
      },
      { upsert: true, new: true }
    );

    return Response.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?linked=success`,
      302
    );
  } catch (error) {
    console.error("Zerodha link error", error);
    const msg = String(error?.message || error);
    // If token is expired or invalid, instruct client to restart the flow
    if (/invalid|expired|TokenException/i.test(msg)) {
      return Response.json({ error: "token_expired", action: "/api/zerodha/start", detail: msg }, { status: 400 });
    }

    // Return error message for debugging (safe in dev). In prod you may want to hide details.
    return Response.json({ error: "Failed to link Zerodha", detail: msg }, { status: 500 });
  }
}


// ...existing code...
export async function GET(request) {
  const user = await currentUser();
  const userId = user?.id;
  const url = new URL(request.url);
  const requestToken = url.searchParams.get("request_token") || url.searchParams.get("requestToken");

  // If user is not signed in (no Clerk session) but Kite redirected here with a request_token,
  // redirect the browser to the client callback page which will preserve cookies and POST the token.
  if (!userId) {
    if (requestToken) {
      const clientCallback = `${process.env.NEXT_PUBLIC_APP_URL}/zerodha/callback?request_token=${encodeURIComponent(
        requestToken
      )}`;
      return Response.redirect(clientCallback, 302);
    }

    return Response.json({ error: "Unauthenticated" }, { status: 401 });
  }

  if (!requestToken) {
    return Response.json({ error: "Missing request_token" }, { status: 400 });
  }

  try {
    const tokenPayload = await exchangeRequestToken({ requestToken });
    await dbConnect();

    await BrokerLink.findOneAndUpdate(
      { userId },
      {
        $set: {
          userId,
          accessToken: tokenPayload?.data?.access_token,
          publicToken: tokenPayload?.data?.public_token,
          refreshToken: tokenPayload?.data?.refresh_token,
          updatedAt: new Date(),
        },
      },
      { upsert: true, new: true }
    );

    return Response.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?linked=success`,
      302
    );
  } catch (error) {
    console.error("Zerodha link error", error);
    const msg = String(error?.message || error);
    if (/invalid|expired|TokenException/i.test(msg)) {
      // If user is signed in but token expired, redirect them to start a new login flow
      return Response.json({ error: "token_expired", action: "/api/zerodha/start", detail: msg }, { status: 400 });
    }

    return Response.json({ error: "Failed to link Zerodha", detail: msg }, { status: 500 });
  }
}