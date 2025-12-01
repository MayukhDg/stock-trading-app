import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { dbConnect } from "@/lib/db";
import { BrokerLink } from "@/models";
import { exchangeRequestToken } from "@/lib/zerodha";

const schema = z.object({
  requestToken: z.string().min(10),
});

export async function POST(request) {
  const { userId } = auth();
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
    return Response.json({ error: "Failed to link Zerodha" }, { status: 500 });
  }
}