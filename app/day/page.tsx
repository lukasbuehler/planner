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
import GoogleCalendar from "@/lib/plan/GoogleCalendar";
import { ButtonBase, Popover } from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs, { Dayjs } from "dayjs";
import TogglTrack from "@/lib/track/TogglTrack";
import Project from "@/models/Project";
import Link from "next/link";

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
  const [projects, setProjects] = useState<Project[]>([]);

  const pathname = usePathname();

  const googleCalendar = new GoogleCalendar();
  const toggl = new TogglTrack();

  useEffect(() => {
    const nextDay = new Date(selectedDay);
    nextDay.setDate(nextDay.getDate() + 1);

    // get planned events
    if (googleCalendar.isAuthenticated()) {
      googleCalendar
        .getAllEventsBetweenDates(selectedDay, nextDay)
        .then((events: Event[]) => {
          setPlannedEvents(events);
        })
        .catch((err) => {
          if (err.message === "Unauthorized") {
            //googleCalendar.authenticate(pathname);
            console.error("Unauthorized", err);
          } else {
            console.error(err);
          }
        });
    } else {
      console.log("Not authenticated");
    }

    // get tracked events
    if (!toggl.isAuthenticated()) {
      toggl.authenticate(pathname);
    }

    toggl.getAllProjectsList().then((projects) => {
      setProjects(projects);
    });

    toggl
      .getAllActivitiesBetweenDates(selectedDay, nextDay)
      .then((events: Event[]) => {
        setTrackedEvents(events);
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
          <Box className="flex flex-row justify-center">
            <ButtonBase
              className="rounded-lg p-1"
              aria-describedby={id}
              onClick={handleClick}
            >
              <Typography variant="h4">
                {selectedDay.toLocaleDateString("default", {
                  weekday: "long",
                }) + ", "}
                {selectedDay.toLocaleDateString("default", {
                  day: "numeric",
                })}
                .
              </Typography>
            </ButtonBase>
            <Link href={"/month"}>
              <ButtonBase className="rounded-lg p-1">
                <Typography variant="h4">
                  {selectedDay.toLocaleDateString("default", { month: "long" })}
                </Typography>
              </ButtonBase>
            </Link>
            <Link href={"/year"}>
              <ButtonBase className="rounded-lg p-1">
                <Typography variant="h4">
                  {selectedDay.getFullYear()}
                </Typography>
              </ButtonBase>
            </Link>
            <Link href={"/week"} className="flex flex-col justify-center ml-5">
              <ButtonBase className="rounded-lg p-1">
                <Typography variant="subtitle1">{"Week 2"}</Typography>
              </ButtonBase>
            </Link>

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
          </Box>
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
