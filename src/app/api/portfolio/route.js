import { auth } from "@clerk/nextjs/server";

import { getDb } from "@/lib/db";
import { fetchHoldings } from "@/lib/zerodha";

export async function GET() {
  const { userId } = auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDb();
    const link = await db.collection("brokerLinks").findOne({ userId });

    if (!link?.accessToken) {
      return Response.json({ holdings: [] });
    }

    const holdings = await fetchHoldings({ accessToken: link.accessToken });

    await db.collection("holdings").updateOne(
      { userId },
      {
        $set: {
          userId,
          holdings,
          syncedAt: new Date(),
        },
      },
      { upsert: true },
    );

    return Response.json({ holdings });
  } catch (error) {
    console.error("Portfolio fetch failed", error);
    return Response.json({ error: "Failed to fetch portfolio" }, { status: 500 });
  }
}

