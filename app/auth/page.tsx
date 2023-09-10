"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";
import { getScopes } from "@/lib/google_calendar/scopes";

export default function Auth() {
  useEffect(() => {
    const hash = window.location.hash;

    const data = hash.split("#")[1];

    if (data) {
      const dataMap: { [key: string]: string } = {};
      data.split("&").forEach((param: string) => {
        const [key, value] = param.split("=");
        dataMap[key] = value;
      });

      // get access token
      console.log("access_token", dataMap["access_token"]);
      localStorage.setItem("access_token", dataMap["access_token"]);

      // check that the strings from getScopes are in the recieved scopes
      for (const scope of getScopes().split(" ")) {
        // check that the scope is a substring
        if (!dataMap["scope"].includes(scope.trim())) {
          console.error("scope not found", scope);
        }
      }

      // redirect from page that placed the auth request.
      const redirectPath: string = dataMap["state"];
      redirect(redirectPath);
    }
  }, []);

  return (
    <div>
      <h1>Redirecting...</h1>
    </div>
  );
}
