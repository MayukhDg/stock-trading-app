const BASE_URL = "https://api.kite.trade";

import crypto from "crypto";

function getHeaders() {
  return {
    "X-Kite-Version": "3",
    "Content-Type": "application/json",
    "X-Api-Key": process.env.ZERODHA_API_KEY || "",
  };
}

export async function exchangeRequestToken({ requestToken }) {
  const apiSecret = (process.env.ZERODHA_API_SECRET || "").trim();
  const apiKey = (process.env.ZERODHA_API_KEY || "").trim();
  if (!apiSecret || !apiKey) {
    throw new Error("Set ZERODHA_API_KEY and ZERODHA_API_SECRET in environment");
  }
  // Normalize and validate incoming request token (accept both names)
  const token = (requestToken || "").toString().trim();
  if (!token) {
    throw new Error("Missing request token");
  }

  // checksum = sha256(api_key + request_token + api_secret)
  const checksum = crypto
    .createHash("sha256")
    .update(`${apiKey}${token}${apiSecret}`)
    .digest("hex");

  const urlSearchParams = new URLSearchParams({
    api_key: apiKey,
    request_token: token,
    checksum,
  });

  const response = await fetch(`${BASE_URL}/session/token`, {
    method: "POST",
    headers: {
      "X-Kite-Version": "3",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: urlSearchParams.toString(),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    // Log debug info to help diagnose checksum issues (token partially masked)
    console.error("Zerodha token exchange failed", {
      status: response.status,
      token_preview: `${token.slice(0, 6)}...${token.slice(-6)}`,
      api_key: apiKey ? `${apiKey.slice(0, 6)}...` : null,
      checksum_preview: `${checksum.slice(0, 6)}...`,
      body: text,
    });
    // In dev expose full checksum in the error to help debugging mismatches
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(
        `Failed to exchange request token: ${response.status} ${text} | checksum=${checksum}`
      );
    }

    throw new Error(`Failed to exchange request token: ${response.status} ${text}`);
  }

  return response.json();
}

export async function fetchHoldings({ accessToken }) {
  const response = await fetch(`${BASE_URL}/portfolio/holdings`, {
    headers: {
      ...getHeaders(),
      Authorization: `token ${process.env.ZERODHA_API_KEY}:${accessToken}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch holdings");
  }
  return response.json();
}

