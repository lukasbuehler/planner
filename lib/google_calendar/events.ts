import Event from "../../models/Event";
import { getAccessToken } from "./auth";

export async function getEventsBetweenDates(
  calendarId: string,
  start: Date,
  end: Date
): Promise<Event[]> {
  const accessToken: string | null = getAccessToken();

  if (!accessToken) {
    throw new Error("Not authenticated!");
  }

  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?` +
      new URLSearchParams({
        timeMin: start.toISOString(),
        timeMax: end.toISOString(),
        singleEvents: "true",
        orderBy: "startTime",
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

  const eventsData = await response.json();

  return eventsData.items.map((item: any) => {
    return {
      name: item.summary,
      start: new Date(item.start.dateTime),
      end: new Date(item.end.dateTime),
    };
  });
}
