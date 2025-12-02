import { currentUser } from "@clerk/nextjs/server";
import { z } from "zod";

import { generateInsights } from "@/lib/ai";

const schema = z.object({
  holdings: z.array(
    z.object({
      symbol: z.string(),
      quantity: z.number().optional(),
      pnl: z.number().optional(),
    }),
  ),
  news: z.array(z.any()).optional(),
});

export async function POST(request) {
  const user = await currentUser();
  const userId = user?.id;
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await request.json();
  const input = schema.safeParse(json);

  if (!input.success) {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }

  try {
    const insights = await generateInsights(input.data);
    return Response.json({ insights });
  } catch (error) {
    console.error("AI insight failed", error);
    return Response.json({ error: "Failed to generate insights" }, { status: 500 });
  }
}

