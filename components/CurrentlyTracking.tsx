"use client";

import { Stop } from "@mui/icons-material";
import { IconButton, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Event from "@/models/Event";
import TogglTrack from "@/lib/track/TogglTrack";

export default function CurrentlyTracking() {
  const [trackingEvent, setTrackingEvent] = useState<Event | null>(null);

  const stopTracking = () => {
    setTrackingEvent(null);
  };

  const updateTracking = () => {
    const toggl = new TogglTrack();

    toggl
      .getCurrentActivity()
      .then((event) => {
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
          style={
            trackingEvent !== null && trackingEvent.project
              ? {
                  color: trackingEvent.project.color,
                  backgroundColor: trackingEvent.project.color + "25",
                }
              : undefined
          }
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
