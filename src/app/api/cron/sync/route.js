import { dbConnect } from "@/lib/db";
import { BrokerLink, Holdings } from "@/models";
import { fetchHoldings } from "@/lib/zerodha";

export async function POST(request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Forbidden", { status: 403 });
  }

  try {
    await dbConnect();
    const links = await BrokerLink.find({ accessToken: { $exists: true, $ne: null } });

    for (const link of links) {
      if (!link.accessToken) continue;
      
      try {
        const holdingsData = await fetchHoldings({ accessToken: link.accessToken });
        
        await Holdings.findOneAndUpdate(
          { userId: link.userId },
          { 
            $set: { 
              holdings: holdingsData?.data || [], 
              syncedAt: new Date() 
            } 
          },
          { upsert: true }
        );
      } catch (error) {
        console.error("Cron sync failed for", link.userId, error);
      }
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Cron sync error:", error);
    return Response.json({ error: "Sync failed" }, { status: 500 });
  }
}