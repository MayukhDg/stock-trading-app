const BASE_URL = "https://api.kite.trade";

function getHeaders() {
  return {
    "X-Kite-Version": "3",
    "Content-Type": "application/json",
    "X-Api-Key": process.env.ZERODHA_API_KEY || "",
  };
}

export async function exchangeRequestToken({ requestToken }) {
  const apiSecret = process.env.ZERODHA_API_SECRET;
  if (!apiSecret) {
    throw new Error("Set ZERODHA_API_SECRET");
  }

  // TODO: generate checksum as per Zerodha docs.
  const checksum = "todo";
  const urlSearchParams = new URLSearchParams({
    api_key: process.env.ZERODHA_API_KEY || "",
    request_token: requestToken,
    checksum,
  });

  const response = await fetch("https://api.kite.trade/session/token", {
    method: "POST",
    headers: {
      "X-Kite-Version": "3",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: urlSearchParams,
  });

  if (!response.ok) {
    throw new Error("Failed to exchange request token");
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

