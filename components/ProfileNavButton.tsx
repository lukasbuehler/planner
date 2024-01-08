"use client";

import GoogleCalendar from "@/lib/plan/GoogleCalendar";
import { Person } from "@mui/icons-material";
import { Button, IconButton, Typography } from "@mui/material";
import { useGoogleLogin, useGoogleOAuth } from "@react-oauth/google";
import { useEffect, useState } from "react";

export default function ProfileNavButton() {
  const { signIn, signOut, user } = useGoogleOAuth();
  const googleCalendar = new GoogleCalendar();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    setIsAuthenticated(googleCalendar.isAuthenticated());
  }, [isAuthenticated]);

  return (
    <IconButton onClick={() => googleCalendar.authenticate()}>
      <Person />
    </IconButton>
  );
}
