import "server-only";

export async function GET() {
  const apiKey = process.env.ZERODHA_API_KEY;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/zerodha/link`;

  if (!apiKey) {
    return Response.json({ error: "Missing ZERODHA_API_KEY" }, { status: 500 });
  }

  const loginUrl = `https://kite.zerodha.com/connect/login?v=3&api_key=${encodeURIComponent(
    apiKey
  )}&redirect_uri=${encodeURIComponent(redirectUri)}`;

  return Response.redirect(loginUrl, 302);
}
