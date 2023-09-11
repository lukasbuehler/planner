import { getAccessToken } from "./auth";

import Calendar from "../../models/Calendar";

export async function getCalendars(): Promise<Calendar[]> {
  const accessToken: string | null = getAccessToken();

  if (!accessToken) {
    throw new Error("Not authenticated!");
  }

  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/users/me/calendarList?` +
      new URLSearchParams({
        minAccessRole: "owner",
        showHidden: "false",
      }),
    {
      cache: "force-cache",
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    if (response.status === 401) {
      // try to refresh token
      throw new Error("Unauthorized");
    }
  }

  const calendarsData = await response.json();

  return calendarsData.items.map((item: any) => {
    return { name: item.summary, id: item.id, color: item.backgroundColor };
  });
}
