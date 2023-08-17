"use client";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Item from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

// dark mode
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function Home() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <main>
        <Container maxWidth={false}>
          {" "}
          {/* no maximum width */}
          <Grid container spacing={2}>
            <Grid item sx={{ display: { xl: "block", xs: "none" } }} xl={3}>
              <Item>
                <Paper elevation={24}>
                  <Typography variant="h5">Projects</Typography>
                </Paper>
              </Item>
            </Grid>
            <Grid item xs={12} md={8} xl={6}>
              <Item>
                <Paper elevation={24}>
                  <Typography variant="h5">Today</Typography>
                </Paper>
              </Item>
            </Grid>
            <Grid
              item
              sx={{ display: { md: "block", xs: "none" } }}
              md={4}
              xl={3}
            >
              <Item>
                <Paper elevation={24}>
                  <Typography variant="h4">Tasks</Typography>
                </Paper>
              </Item>
            </Grid>
          </Grid>
        </Container>
      </main>
    </ThemeProvider>
  );
}
