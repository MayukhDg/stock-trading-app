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
  // Critical: Ensure no whitespace or encoding issues
  const apiSecret = (process.env.ZERODHA_API_SECRET || "").toString().trim();
  const apiKey = (process.env.ZERODHA_API_KEY || "").toString().trim();
  
  if (!apiSecret || !apiKey) {
    throw new Error("Set ZERODHA_API_KEY and ZERODHA_API_SECRET in environment");
  }
  
  // Normalize the request token - remove any whitespace/newlines
  const token = (requestToken || "").toString().trim().replace(/\s+/g, '');
  
  if (!token) {
    throw new Error("Missing or invalid request token");
  }

  // CRITICAL: Checksum must be calculated exactly as: sha256(api_key + request_token + api_secret)
  // No delimiters, no encoding, just concatenation
  const checksumInput = `${apiKey}${token}${apiSecret}`;
  const checksum = crypto
    .createHash("sha256")
    .update(checksumInput, 'utf8')
    .digest("hex");

  console.log("Debug Zerodha token exchange:", {
    api_key_length: apiKey.length,
    token_length: token.length,
    secret_length: apiSecret.length,
    token_preview: `${token.slice(0, 8)}...${token.slice(-8)}`,
    checksum_preview: checksum.slice(0, 16),
  });

  // Form data must be URL-encoded
  const formData = new URLSearchParams({
    api_key: apiKey,
    request_token: token,
    checksum: checksum,
  });

  const response = await fetch(`${BASE_URL}/session/token`, {
    method: "POST",
    headers: {
      "X-Kite-Version": "3",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    let errorData;
    
    try {
      errorData = JSON.parse(text);
    } catch {
      errorData = { message: text };
    }

    console.error("Zerodha token exchange failed:", {
      status: response.status,
      error: errorData,
      token_preview: `${token.slice(0, 6)}...${token.slice(-6)}`,
    });

    // Provide helpful error messages
    if (errorData.message?.includes("checksum")) {
      throw new Error(
        "Checksum validation failed. Please verify:\n" +
        "1. ZERODHA_API_KEY and ZERODHA_API_SECRET are correct\n" +
        "2. No extra spaces in environment variables\n" +
        "3. Request token is fresh (expires in ~10 minutes)"
      );
    }

    throw new Error(
      errorData.message || `Token exchange failed: ${response.status}`
    );
  }

  return response.json();
}

export async function fetchHoldings({ accessToken }) {
  const apiKey = process.env.ZERODHA_API_KEY;
  
  if (!apiKey || !accessToken) {
    throw new Error("Missing API key or access token");
  }

  const response = await fetch(`${BASE_URL}/portfolio/holdings`, {
    headers: {
      ...getHeaders(),
      Authorization: `token ${apiKey}:${accessToken}`,
    },
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    console.error("Failed to fetch holdings:", response.status, text);
    throw new Error(`Failed to fetch holdings: ${response.status}`);
  }

  return response.json();
}