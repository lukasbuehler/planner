import Paper from "@mui/material/Paper";
import Event from "@/models/Event";
import { Box, Chip, Typography } from "@mui/material";
import { useState, useEffect } from "react";

interface CalendarDayViewProps {
  name: string;
  date: Date;
  events: Event[];
  showHours?: boolean;
}

export default function CalendarDayView({
  name,
  date,
  events,
  showHours = true,
}: CalendarDayViewProps) {
  const utcOffsetMs = date.getTimezoneOffset() * 60 * 1000;

  const [hours, setHours] = useState<string[]>(Array<string>(25));

  useEffect(() => {
    const hours = Array<string>(25);
    for (let i = 0; i < 25; i++) {
      const hour = new Date();
      hour.setHours(i % 24);
      hour.setMinutes(0);
      hour.setSeconds(0);
      hours[i] = hour.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        hour12: false, // TODO change when locale is working
      });
    }
    setHours(hours);
  }, []);

  return (
    <div className="relative w-full h-full flex flex-row">
      {/* Calendar Hours */}
      {showHours ? (
        <Box className="h-full flex flex-col">
          {/* Padding */}
          <div className="h-8"></div>
          <div className="relative grow flex flex-col items-stretch justify-between mr-1">
            {Array.from({ length: 25 }).map((_, i) => {
              return (
                <span key={i} className="text-xs text-right">
                  {hours[i]}
                </span>
              );
            })}
          </div>
        </Box>
      ) : null}

      {/* Calendar */}
      <div className="grow relative flex flex-col  items-center">
        <Box className="relative h-8 w-full">
          <Box className="absolute left-0 right-0 top-0 bottom-0 text-center">
            <Chip label={name} variant="outlined" className="relative" />
          </Box>
        </Box>

        <Box className="relative grow my-2 w-full">
          {/* Calendar background */}
          <div className="absolute flex flex-col items-stretch h-full w-full">
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className="grow border-b first:border-t border-solid border-gray-600"
              ></div>
            ))}
          </div>

          {/* Calendar items */}
          <div className="absolute w-full h-full overflow-clip">
            {events.map((event, i) => (
              <Paper
                key={i}
                elevation={5}
                className="absolute rounded-xl left-1 right-1 overflow-hidden"
                style={{
                  top: `calc(100% * ${
                    (event.start.getTime() - date.getTime()) /
                    (1000 * 60 * 60 * 24)
                  })`,
                  height: `calc(100% * ${
                    ((event.end ? event.end.getTime() : new Date().getTime()) -
                      event.start.getTime()) /
                    (1000 * 60 * 60 * 24)
                  })`,
                  backgroundColor: event.project?.color ?? "#dc2626",
                }}
              >
                <Box className="block w-full p-2 truncate">
                  {event.name ? (
                    <Typography variant="caption" className="pr-2">
                      {event.name}
                    </Typography>
                  ) : null}
                  {event.project ? (
                    <Typography variant="caption" className="font-semibold">
                      {event.project.name}
                    </Typography>
                  ) : null}
                </Box>
              </Paper>
            ))}
          </div>

          {/* Calendar time pointer */}
          {new Date().toDateString() === date.toDateString() ? (
            <div
              className="absolute w-full h-0.5 bg-gray-300"
              style={{
                top: `calc(100% * ${
                  (new Date().getHours() * 60 + new Date().getMinutes()) /
                  (60 * 24)
                })`,
              }}
            ></div>
          ) : null}
        </Box>
      </div>
    </div>
  );
}
