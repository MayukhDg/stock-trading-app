import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

import { fetchNews } from "@/lib/news";

const schema = z.object({
  tickers: z.array(z.string()).default([]),
});

export async function POST(request) {
  const { userId } = auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }

  try {
    const news = await fetchNews(parsed.data);
    return Response.json({ news });
  } catch (error) {
    console.error("News fetch error", error);
    return Response.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}

