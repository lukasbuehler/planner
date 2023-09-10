// https://github.com/timfee/meet/blob/main/lib/availability/getAccessToken.ts

const REDIRECT_URI = "http://localhost:3000/auth";

import { usePathname } from "next/navigation";
import getScopes from "./scopes";

/**
 * Opens a new tab for the user to sign in to Google and grant access to the app.
 *
 * Follows the steps outlined in the Google Calendar API Quickstart guide:
 * https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow#obtainingaccesstokens
 */
function oauthSignIn(redirectPath: string) {
  // Google's OAuth 2.0 endpoint for requesting an access token
  var oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";

  const params = {
    client_id: process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID || "",
    redirect_uri: REDIRECT_URI,
    response_type: "token",
    scope: getScopes(),
    include_granted_scopes: "true",
    state: redirectPath,
  };

  // Create <form> element to submit parameters to OAuth 2.0 endpoint.
  var form = document.createElement("form");
  form.setAttribute("method", "GET"); // Send as a GET request.
  form.setAttribute("action", oauth2Endpoint);

  // Add form parameters as hidden input values.
  for (var p in params) {
    var input = document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("name", p);
    input.setAttribute("value", params[p as keyof typeof params]);

    form.appendChild(input);
  }

  // Add form to page and submit it to open the OAuth 2.0 endpoint.
  document.body.appendChild(form);
  form.submit();
}

export default function getAccessToken(): string | null {
  const accessToken = localStorage.getItem("access_token");

  if (accessToken) {
    console.log("Access token found in local storage");
    return accessToken;
  } else {
    console.log("Access token not found in local storage");
    oauthSignIn(usePathname());
    return null;
  }
}
