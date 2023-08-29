import { gapi } from "gapi-script";
import { Event } from "../models/Event";
import credentials from "../client_secret.json";

gapi.load("calendar", "V3", initClient);

function initClient() {
  gapi.client
    .init({
      apiKey: "",
      client_id: credentials.web.client_id,
      discoveryDocs: [
        "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
      ],
      scope: "https://www.googleapis.com/auth/calendar.readonly",
    })
    .then(() => {
      // Set the access token using the refresh token.
      const accessToken = gapi.auth.getToken().access_token;

      console.log(accessToken);
    })
    .catch((err: any) => {
      console.error("Caught error", err);
    });
}

export function getEventsForToday(): Promise<Event[]> {
  return new Promise((resolve, reject) => {
    // Get the current date and time.
    const now = new Date();

    // Set the start and end times for the events query.
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1
    );

    // Call the Google Calendar API to retrieve the events for today.
    //   gapi.client.calendar.events
    //     .list({
    //       calendarId: "primary",
    //       timeMin: startOfDay.toISOString(),
    //       timeMax: endOfDay.toISOString(),
    //       singleEvents: true,
    //       orderBy: "startTime",
    //     })
    //     .then((response: any) => {
    //       const events = response.result.items;
    //       if (events?.length) {
    //         console.log("Events for today:");
    //         const events2: Event[] = events
    //           .filter((event: any) => event?.start?.dateTime || event?.end?.date)
    //           .map((event: any) => {
    //             // both of those will never output empty strings because of the filter above
    //             // typescript is just stupid and won't recognize that
    //             const start: string =
    //               event?.start?.dateTime || event?.start?.date || "";
    //             const end: string =
    //               event?.end?.dateTime || event?.end?.date || "";
    //             console.log(`${start} - ${event.summary}`);

    //             return {
    //               //title: event.summary,
    //               start: new Date(start),
    //               end: new Date(end),
    //             };
    //           });
    //         resolve(events2);
    //       } else {
    //         console.log("No events found for today.");
    //       }
    //     });
  });
}
