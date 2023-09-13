"use client";

import { getCurrentlyTracking } from "@/lib/track/toggl/currentlyTracking";
import { Stop } from "@mui/icons-material";
import { IconButton, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Event from "@/models/Event";

export default function CurrentlyTracking() {
  const [trackingEvent, setTrackingEvent] = useState<Event | null>(null);

  const stopTracking = () => {
    setTrackingEvent(null);
  };

  const updateTracking = () => {
    getCurrentlyTracking()
      .then((event) => {
        console.log(event);
        setTrackingEvent(event);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    setInterval(() => {
      updateTracking();
    }, 30000);
    updateTracking();
  }, []);

  return (
    <Paper className="w-full px-5 h-full rounded-xl flex flex-row items-center">
      {trackingEvent ? (
        <IconButton
          aria-label="fingerprint"
          color="primary"
          className="bg-neutral-700"
          onClick={() => stopTracking()}
        >
          <Stop />
        </IconButton>
      ) : null}
      <Typography variant="h6" className="mx-5">
        {trackingEvent !== null ? trackingEvent.name : "Not Tracking anything"}
      </Typography>
      <Typography variant="body1" className="">
        {trackingEvent !== null
          ? Math.round(
              (new Date().getTime() - trackingEvent.start.getTime()) /
                (60 * 1000)
            ) + " mins"
          : null}
      </Typography>
    </Paper>
  );
}
