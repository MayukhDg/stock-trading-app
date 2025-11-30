import { getDb } from "@/lib/db";
import { fetchHoldings } from "@/lib/zerodha";

export async function POST(request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Forbidden", { status: 403 });
  }

  const db = await getDb();
  const links = await db.collection("brokerLinks").find().toArray();

  for (const link of links) {
    if (!link.accessToken) continue;
    try {
      const holdings = await fetchHoldings({ accessToken: link.accessToken });
      await db.collection("holdings").updateOne(
        { userId: link.userId },
        { $set: { holdings, syncedAt: new Date() } },
        { upsert: true },
      );
    } catch (error) {
      console.error("Cron sync failed for", link.userId, error);
    }
  }

  return Response.json({ ok: true });
}

