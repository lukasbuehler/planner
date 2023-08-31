"use client";

import Chip from "@mui/material/Chip";

import { useState } from "react";

import CalendarDayView from "@/components/CalendarDayView";
import Box from "@mui/material/Box";

import Event from "@/models/Event";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import { NavigateBefore, NavigateNext } from "@mui/icons-material";

import ApiCalendar from "react-google-calendar-api";

import { api_key } from "../../api_key_secret.json";
import * as client_secret from "../../client_secret.json";

const config = {
  clientId: client_secret.web.client_id,
  apiKey: api_key,

  scope: "https://www.googleapis.com/auth/calendar",
  discoveryDocs: [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
  ],
};

const apiCalendar = new ApiCalendar(config);

export default function DayOverview() {
  const [plannedEvents, setPlannedEvents] = useState<Event[]>([
    // {
    //   name: "Event 1",
    //   start: new Date("2021-10-10T10:00:00"),
    //   end: new Date("2021-10-10T11:00:00"),
    // },
    // {
    //   name: "Event 2",
    //   start: new Date("2021-10-10T12:00:00"),
    //   end: new Date("2021-10-10T12:30:00"),
    // },
  ]);
  const [trackedEvents, setTrackedEvents] = useState<Event[]>([
    {
      name: "Tracking Event 2 with a very long name that should be truncated",
      start: new Date("2021-10-10T11:00:00"),
      end: new Date("2021-10-10T14:00:00"),
    },
  ]);

  apiCalendar.listUpcomingEvents(10).then(({ result }: any) => {
    console.log(result.items);
  });

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
