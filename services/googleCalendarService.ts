import { google } from "googleapis";
import { Event } from "../components/CalendarDayView";

// Load client secrets from a local file.
const credentials = require("./client_secret.json");

// Create an OAuth2 client with the given credentials.
const { client_secret, client_id, redirect_uris } = credentials.installed;
const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);

// Set the access token using the refresh token.
oAuth2Client.setCredentials({
  refresh_token: "REFRESH_TOKEN_HERE",
});

// Get the current date and time.
const now = new Date();

// Set the start and end times for the events query.
const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

// Call the Google Calendar API to retrieve the events for today.
const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

export function getEventsForToday(): Promise<Event[]> {
  return new Promise((resolve, reject) => {
    calendar.events.list(
      {
        calendarId: "primary",
        timeMin: startOfDay.toISOString(),
        timeMax: endOfDay.toISOString(),
        singleEvents: true,
        orderBy: "startTime",
      },
      (err, res) => {
        if (err) return console.error("The API returned an error: " + err);
        const events = res?.data.items;
        if (events?.length) {
          console.log("Events for today:");
          const events2: Event[] = events.map((event, i) => {
            const start = event.start.dateTime || event.start.date;
            const end = event.end.dateTime || event.end.date;
            console.log(`${start} - ${event.summary}`);
            return {
              //title: event.summary,
              start: new Date(start),
              end: new Date(end),
            };
          });
        } else {
          console.log("No events found for today.");
        }
      }
    );
  });
}
