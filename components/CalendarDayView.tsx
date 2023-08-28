import Paper from "@mui/material/Paper";

export interface Event {
  start: Date;
  end: Date;
}

interface CalendarDayViewProps {
  events: Event[];
  showHours?: boolean;
}

export function CalendarDayView({
  showHours = true,
  events,
}: CalendarDayViewProps) {
  return (
    <div className="relative w-full h-full flex flex-row items-stretch">
      {/* Calendar Hours */}
      {showHours ? (
        <div className="relative flex flex-col items-stretch justify-between mr-1">
          {Array.from({ length: 25 }).map((_, i) => (
            <span key={i} className="text-xs text-right">
              {i % 24}:00
            </span>
          ))}
        </div>
      ) : null}

      {/* Calendar */}
      <div className="grow relative my-2">
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
        <div className="relative h-full">
          {events.map((event, i) => (
            <Paper
              key={i}
              elevation={5}
              className="absolute rounded-xl left-0 right-0 top-16 h-12 bg-red-600"
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
              <div className="p-2 truncate">
                {event.start.toLocaleTimeString()} -{" "}
                {event.end.toLocaleTimeString()}
              </div>
            </Paper>
          ))}
        </div>
      </div>
    </div>
  );
}
