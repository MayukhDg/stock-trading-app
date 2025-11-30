export const faqs = [
  {
    q: "Is Zerodha access secure?",
    a: "Yes. We only request read scopes, store refresh tokens AES-256 encrypted, and rotate them every 12 hours. You can revoke access anytime from Kite.",
  },
  {
    q: "Do you place trades automatically?",
    a: "No. PulseIQ provides insights, alerts, and recommended orders. You execute the trades yourself until auto-trading is approved by exchanges.",
  },
  {
    q: "Which AI model powers insights?",
    a: "We default to OpenAI GPT-4o Mini for latency and hallucination controls but you can bring your own key for Mistral or Azure OpenAI.",
  },
  {
    q: "How often is the portfolio refreshed?",
    a: "Starter plans fetch once every day, Pro plans every 5 minutes during market hours, and enterprise plans can stream via WebSockets.",
  },
];

