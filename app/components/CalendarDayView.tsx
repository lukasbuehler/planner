import Paper from "@mui/material/Paper";

const events = [
  {
    start: new Date(Date.parse("2022-01-01T09:00:00")),
    end: new Date(Date.parse("2022-01-01T10:00:00")),
  },
  {
    start: new Date(Date.parse("2022-01-01T11:00:00")),
    end: new Date(Date.parse("2022-01-01T12:00:00")),
  },
  {
    start: new Date(Date.parse("2022-01-01T15:00:00")),
    end: new Date(Date.parse("2022-01-01T16:00:00")),
  },
];

export default function CalendarDayView() {
  return (
    <div className="mt-3 grow flex flex-row w-full">
      <div className="relative grow h-full flex flex-row items-stretch">
        {/* Calendar Hours */}
        <div className="relative flex flex-col items-stretch justify-between mr-1">
          {Array.from({ length: 25 }).map((_, i) => (
            <span key={i} className="text-xs text-right">
              {i}:00
            </span>
          ))}
        </div>

        {/* Calendar */}
        <div className="grow relative my-2">
          {/* Calendar background */}
          <div className="absolute flex flex-col items-stretch h-full w-full">
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className="grow border-b first:border-t border-solid border-gray-400"
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
                <div className="p-2">
                  {event.start.toLocaleTimeString()} -{" "}
                  {event.end.toLocaleTimeString()}
                </div>
              </Paper>
            ))}
          </div>
        </div>
      </div>

      <div className="h-full grow">toggl</div>
    </div>
  );
}
