"use client";

import { useState, useEffect } from "react";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Item from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Button from "@mui/material/Button";

// icons
import RestoreIcon from "@mui/icons-material/Restore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MenuIcon from "@mui/icons-material/Menu";

// dark mode
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import CalendarDayView from "../components/CalendarDayView";
import Event from "../models/Event";

// Services
import { getEventsForToday } from "../services/googleCalendarService";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    getEventsForToday().then((events) => {
      setEvents(events);
    });
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <main className="h-full">
        <Box
          className="h-full flex"
          sx={{
            flexDirection: { CalendarDayViewxs: "column", md: "row-reverse" },
          }}
        >
          <Container maxWidth={false} className="grow">
            {/* no maximum width */}
            <Grid container spacing={2} className="h-28 w-full">
              <Grid
                item
                xs={0}
                md={3}
                sx={{ display: { md: "block", xs: "none" } }}
              >
                <Item className="w-full h-full py-4 flex items-center">
                  <Typography variant="h4">Planner</Typography>
                </Item>
              </Grid>
              <Grid item xs={12} md={6}>
                <Item className="w-full h-full py-4 flex items-center">
                  <TextField
                    id="search"
                    variant="outlined"
                    className="w-full"
                    placeholder="Search"
                  />
                </Item>
              </Grid>
            </Grid>
            <Grid
              container
              spacing={2}
              style={{ height: "calc(100% + 16px - 7rem)" }}
            >
              {/* Side Bar */}
              <Grid item sx={{ display: { xl: "block", xs: "none" } }} xl={3}>
                <Item className="h-full">
                  <Button>New Task</Button>
                  <Typography variant="h6">Projects</Typography>
                  <Typography variant="h6">Study Buddies</Typography>
                </Item>
              </Grid>

              {/* Today Calendar View */}
              <Grid item xs={12} md={8} xl={6} className="">
                <Item className="h-full">
                  <Paper
                    elevation={3}
                    className="p-5 rounded-xl h-full flex flex-col items-start"
                  >
                    <Chip label="Today" variant="outlined" />

                    <div className="mt-3 grow flex flex-row w-full">
                      {/* Calendar */}
                      <div className="grow h-full mr-3">
                        <CalendarDayView events={events} />
                      </div>

                      {/* Tracked Time */}
                      <div className="grow h-full">
                        <CalendarDayView events={[]} showHours={false} />
                      </div>
                    </div>
                  </Paper>
                </Item>
              </Grid>

              {/* Task Side Panel */}
              <Grid
                item
                sx={{ display: { md: "block", xs: "none" } }}
                md={4}
                xl={3}
              >
                <Item className="h-full">
                  <Paper elevation={3} className="p-5 rounded-xl h-full">
                    <Typography variant="h5">Tasks</Typography>
                  </Paper>
                </Item>
              </Grid>
            </Grid>
          </Container>
          <BottomNavigation
            showLabels
            sx={{
              flexDirection: { md: "column", xs: "row" },
              height: { xs: "auto", md: "100%" },
              justifyContent: { xs: "center", md: "start" },
            }}
          >
            <BottomNavigationAction
              label=""
              icon={<MenuIcon />}
              className="grow-0 p-3 mb-5 mt-3"
              sx={{ display: { xs: "none", md: "block" } }}
            />
            <BottomNavigationAction
              label="Recents"
              icon={<RestoreIcon />}
              className="grow-0 p-3"
            />
            <BottomNavigationAction
              label="Favorites"
              icon={<FavoriteIcon />}
              className="grow-0 p-3"
            />
            <BottomNavigationAction
              label="Nearby"
              icon={<LocationOnIcon />}
              className="grow-0 p-3"
            />
          </BottomNavigation>
        </Box>
      </main>
    </ThemeProvider>
  );
}
