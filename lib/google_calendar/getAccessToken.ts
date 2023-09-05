// https://github.com/timfee/meet/blob/main/lib/availability/getAccessToken.ts

export default async function getAccessToken(): Promise<string> {
  const params = {
    grant_type: "refresh_token",
    client_id: process.env.GOOGLE_OAUTH_CLIENT_ID || "",
    client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET || "",
    refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN || "",
  };

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(params).toString(),
    cache: "no-cache",
  });

  const json = await response.json();

  if (!json.access_token) {
    throw new Error("No access token found in response");
  }

  return json.access_token as string;
}
