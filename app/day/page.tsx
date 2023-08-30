"use client";

import Chip from "@mui/material/Chip";

import { useState } from "react";

import CalendarDayView from "@/components/CalendarDayView";
import Box from "@mui/material/Box";

import Event from "@/models/Event";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import { NavigateBefore, NavigateNext } from "@mui/icons-material";

export default function DayOverview() {
  const [plannedEvents, setPlannedEvents] = useState<Event[]>([
    {
      name: "Event 1",
      start: new Date("2021-10-10T10:00:00"),
      end: new Date("2021-10-10T11:00:00"),
    },
    {
      name: "Event 2",
      start: new Date("2021-10-10T12:00:00"),
      end: new Date("2021-10-10T12:30:00"),
    },
  ]);
  const [trackedEvents, setTrackedEvents] = useState<Event[]>([
    {
      name: "Tracking Event 2 with a very long name that should be truncated",
      start: new Date("2021-10-10T11:00:00"),
      end: new Date("2021-10-10T14:00:00"),
    },
  ]);

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
      <Box className="w-full flex flex-row justify-between pb-3">
        <IconButton>
          <NavigateBefore />
        </IconButton>
        <Box className="flex flex-row justify-center">
          <Chip label="Today" variant="outlined" className="mr-3" />
          <Typography variant={"h4"}>
            {new Date().toLocaleDateString()}
          </Typography>
        </Box>
        <IconButton>
          <NavigateNext />
        </IconButton>
      </Box>

      <div className="mt-3 grow flex flex-row w-full">
        {/* Calendar */}
        <div className="grow h-full">
          <CalendarDayView name="Plan" events={plannedEvents} />
        </div>

        {/* Tracked Time */}
        <div className="grow h-full">
          <CalendarDayView
            name="Track"
            events={trackedEvents}
            showHours={false}
          />
        </div>
      </div>
    </Box>
  );
}
