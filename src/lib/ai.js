import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateInsights({ holdings = [], news = [] }) {
  if (!process.env.OPENAI_API_KEY) {
    return [
      {
        id: "mock",
        ticker: "DEMO",
        recommendation: "Connect OpenAI to enable live insights",
        rationale:
          "Set OPENAI_API_KEY and deploy the worker to receive contextual recommendations in under 10s.",
        time: "now",
      },
    ];
  }

  const messages = [
    {
      role: "system",
      content:
        "You are PulseIQ, an Indian equities copilot. Produce JSON array with ticker, recommendation, rationale, confidence.",
    },
    {
      role: "user",
      content: JSON.stringify({
        holdings,
        news,
      }),
    },
  ];

  const completion = await openai.responses.create({
    model: "gpt-4o-mini",
    input: messages,
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "insights",
        schema: {
          type: "object",
          properties: {
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  ticker: { type: "string" },
                  recommendation: { type: "string" },
                  rationale: { type: "string" },
                  confidence: { type: "string" },
                },
                required: ["ticker", "recommendation", "rationale"],
              },
            },
          },
          required: ["items"],
        },
      },
    },
  });

  const parsed = JSON.parse(completion.output[0].content[0].text);

  return parsed.items.map((item, idx) => ({
    id: `${item.ticker}-${idx}`,
    time: "now",
    ...item,
  }));
}

