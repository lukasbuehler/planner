"use client";

import Chip from "@mui/material/Chip";

import { useState } from "react";

import CalendarDayView from "@/components/CalendarDayView";
import Box from "@mui/material/Box";

export default function DayOverview() {
  const [events, setEvents] = useState<Event[]>([]);

  // export async function getEventsForToday(): Promise<Event[]> {
  //       const now = new Date();

  //       // Set the start and end times for the events query.
  //       const startOfDay = new Date(
  //         now.getFullYear(),
  //         now.getMonth(),
  //         now.getDate()
  //       );
  //       const endOfDay = new Date(
  //         now.getFullYear(),
  //         now.getMonth(),
  //         now.getDate() + 1
  //       );

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
  //}

  return (
    <Box className="h-full flex flex-col items-start">
      <Chip label="Today" variant="outlined" />

      <div className="mt-3 grow flex flex-row w-full">
        {/* Calendar */}
        <div className="grow h-full mr-3">
          <CalendarDayView events={events} />
        </div>

        {/* Tracked Time */}
        <div className="grow h-full">
          <CalendarDayView events={[]} showHours={false} />
        </div>
      </div>
    </Box>
  );
}
