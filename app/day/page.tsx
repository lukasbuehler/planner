"use client";

import { useEffect, useState } from "react";

import { usePathname } from "next/navigation";

import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { NavigateBefore, NavigateNext } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import Event from "@/models/Event";
import CalendarDayView from "@/components/CalendarDayView";
import Box from "@mui/material/Box";
import { getEventsBetweenDates } from "@/lib/plan/google_calendar/events";
import { getCalendars } from "@/lib/plan/google_calendar/eventGroups";
import {
  authenticateIfNecessary,
  reauthenticate,
} from "@/lib/plan/google_calendar/auth";
import { ButtonBase, Paper, Popover } from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs, { Dayjs } from "dayjs";
import { getCurrentlyTracking } from "@/lib/track/toggl/currentlyTracking";

export default function DayOverview() {
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

  const [selectedDay, setSelectedDay] = useState<Date>(today);
  const [plannedEvents, setPlannedEvents] = useState<Event[]>([]);
  const [trackedEvents, setTrackedEvents] = useState<Event[]>([]);

  const pathname = usePathname();

  useEffect(() => {
    authenticateIfNecessary(pathname);

    const nextDay = new Date(selectedDay);
    nextDay.setDate(nextDay.getDate() + 1);

    // get planned events
    getCalendars()
      .then((calendars) => {
        // get all events for all calendars for today

        const promises = calendars.map((calendar) => {
          return getEventsBetweenDates(calendar.id, selectedDay, nextDay);
        });

        Promise.all(promises).then((events) => {
          const allEvents = events.flat();

          setPlannedEvents(allEvents);
        });
      })
      .catch((err) => {
        if (err.message === "Unauthorized") {
          reauthenticate(pathname);
        } else {
          console.error(err);
        }
      });

    // get tracked events
    getCurrentlyTracking()
      .then((event) => {
        setTrackedEvents(event ? [event] : []);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [selectedDay]);

  const [popoverAnchorEl, setPopoverAnchorEl] =
    useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setPopoverAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setPopoverAnchorEl(null);
  };

  const open = Boolean(popoverAnchorEl);
  const id = open ? "simple-popover" : undefined;

  const incrementDay = () => {
    const newDate = new Date(selectedDay);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDay(newDate);
  };

  const decrementDay = () => {
    const newDate = new Date(selectedDay);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDay(newDate);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box className="h-full flex flex-col items-start">
        <Box className="w-full flex flex-row justify-between items-center">
          <IconButton onClick={decrementDay}>
            <NavigateBefore />
          </IconButton>
          <ButtonBase
            className="flex flex-row justify-center rounded-lg p-2"
            aria-describedby={id}
            onClick={handleClick}
          >
            <Typography variant={"h4"}>{selectedDay.toDateString()}</Typography>
          </ButtonBase>
          <Popover
            id={id}
            open={open}
            anchorEl={popoverAnchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <DateCalendar
              value={dayjs(selectedDay)}
              onChange={(newDate: Dayjs | null) => {
                if (newDate) {
                  setSelectedDay(newDate.toDate());
                }
              }}
            />
          </Popover>
          <IconButton onClick={incrementDay}>
            <NavigateNext />
          </IconButton>
        </Box>

        <div className="mt-1 grow flex flex-row w-full">
          {/* Calendar */}
          <div className="grow h-full">
            <CalendarDayView
              name="Plan"
              events={plannedEvents}
              date={selectedDay}
            />
          </div>

          {/* Tracked Time */}
          <div className="grow h-full">
            <CalendarDayView
              name="Track"
              events={trackedEvents}
              date={selectedDay}
              showHours={false}
            />
          </div>
        </div>
      </Box>
    </LocalizationProvider>
  );
}
