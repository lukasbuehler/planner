import Event from "../../models/Event";
import getAccessToken from "./getAccessToken";

export default async function getEventsBetweenDates({
  calendarId,
  start,
  end,
}: {
  calendarId: string;
  start: Date;
  end: Date;
}): Promise<Event[]> {
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
    {
      cache: "no-cache",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getAccessToken()}`,
      },
      body: JSON.stringify({
        timeMin: start.toISOString(),
        timeMax: end.toISOString(),
        singleEvents: true,
        orderBy: "startTime",
      }),
    }
  );

  const eventsData = await response.json();

  // TODO

  return [];
}
