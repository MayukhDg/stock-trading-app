import { currentUser } from "@clerk/nextjs/server";
import { dbConnect } from "@/lib/db";
import { BrokerLink, Holdings } from "@/models";
import { fetchHoldings } from "@/lib/zerodha";

export async function GET() {
  const user = await currentUser();
  const userId = user?.id;
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const link = await BrokerLink.findOne({ userId });

    if (!link?.accessToken) {
      return Response.json({ holdings: [] });
    }

    const holdingsData = await fetchHoldings({ accessToken: link.accessToken });

    const holdings = (holdingsData?.data || []).map((h) => ({
      symbol: h.tradingsymbol || h.symbol || "N/A",
      quantity: h.quantity || 0,
      averagePrice: h.average_price || 0,
      ltp: h.last_price || h.ltp || 0,
      pnl: h.pnl || 0,
      last_price: h.last_price || h.ltp || 0,
    }));

    await Holdings.findOneAndUpdate(
      { userId },
      {
        $set: {
          userId,
          holdings,
          syncedAt: new Date(),
        },
      },
      { upsert: true, new: true }
    );

    return Response.json({ holdings });
  } catch (error) {
    console.error("Portfolio fetch failed", error);
    return Response.json({ error: "Failed to fetch portfolio" }, { status: 500 });
  }
}