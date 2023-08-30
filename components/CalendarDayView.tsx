import Paper from "@mui/material/Paper";
import Event from "@/models/Event";
import { Box, Typography } from "@mui/material";

interface CalendarDayViewProps {
  name: string;
  events: Event[];
  showHours?: boolean;
}

export default function CalendarDayView({
  name,
  showHours = true,
  events,
}: CalendarDayViewProps) {
  return (
    <div className="relative w-full h-full flex flex-row">
      {/* Calendar Hours */}
      {showHours ? (
        <Box className="h-full flex flex-col">
          {/* Padding */}
          <div className="h-6"></div>
          <div className="relative grow flex flex-col items-stretch justify-between mr-1">
            {Array.from({ length: 25 }).map((_, i) => (
              <span key={i} className="text-xs text-right">
                {i % 24}:00
              </span>
            ))}
          </div>
        </Box>
      ) : null}

      {/* Calendar */}
      <div className="grow relative flex flex-col  items-center">
        <Box className="relative h-6 w-full">
          <Box className="absolute left-0 right-0 top-0 bottom-0 text-center">
            {name}
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
          <div className="absolute w-full h-full">
            {events.map((event, i) => (
              <Paper
                key={i}
                elevation={5}
                className="absolute rounded-xl left-1 right-1 bg-red-600 overflow-hidden"
                style={{
                  top: `calc(100% * ${
                    (event.start.getHours() * 60 + event.start.getMinutes()) /
                    (60 * 24)
                  })`,
                  height: `calc(100% * ${
                    Math.abs(event.end.getTime() - event.start.getTime()) /
                    (1000 * 60 * 60 * 24)
                  })`,
                }}
              >
                <Typography
                  variant="caption"
                  className="block w-full p-2 truncate"
                >
                  {event.name}
                </Typography>
              </Paper>
            ))}
          </div>

          {/* Calendar time pointer */}
          <div
            className="absolute w-full h-0.5 bg-gray-300"
            style={{
              top: `calc(100% * ${
                (new Date().getHours() * 60 + new Date().getMinutes()) /
                (60 * 24)
              })`,
            }}
          ></div>
        </Box>
      </div>
    </div>
  );
}
