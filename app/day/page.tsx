"use client";

import Chip from "@mui/material/Chip";

import { useEffect, useState } from "react";

import { usePathname } from "next/navigation";

import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { NavigateBefore, NavigateNext } from "@mui/icons-material";

import Event from "@/models/Event";
import CalendarDayView from "@/components/CalendarDayView";
import Box from "@mui/material/Box";
import { getEventsBetweenDates } from "@/lib/google_calendar/events";
import { getCalendars } from "@/lib/google_calendar/calendars";
import { authenticateIfNecessary } from "@/lib/google_calendar/auth";

export default function DayOverview() {
  const [plannedEvents, setPlannedEvents] = useState<Event[]>([]);
  const [trackedEvents, setTrackedEvents] = useState<Event[]>([]);

  const pathname = usePathname();

  const now = new Date();
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0,
    0
  );
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  useEffect(() => {
    authenticateIfNecessary(pathname);

    getCalendars().then((calendars) => {
      // get all events for all calendars for today

      const promises = calendars.map((calendar) => {
        return getEventsBetweenDates(calendar.id, today, tomorrow);
      });

      Promise.all(promises).then((events) => {
        const allEvents = events.flat();

        setPlannedEvents(allEvents);
      });
    });
  }, []);

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
          <CalendarDayView name="Plan" events={plannedEvents} date={today} />
        </div>

        {/* Tracked Time */}
        <div className="grow h-full">
          <CalendarDayView
            name="Track"
            events={trackedEvents}
            date={today}
            showHours={false}
          />
        </div>
      </div>
    </Box>
  );
}
