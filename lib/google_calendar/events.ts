import Event from "../../models/Event";
import getAccessToken from "./auth";

export default async function getEventsBetweenDates(
  calendarId: string,
  start: Date,
  end: Date
): Promise<Event[]> {
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
    {
      cache: "no-cache",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${getAccessToken()}`,
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

  console.log(eventsData);

  // TODO

  return [];
}
