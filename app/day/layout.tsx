import Grid from "@mui/material/Grid";
import Item from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

import TasksView from "@/components/TasksView";
import ProjectOverviewList from "@/components/ProjectOverviewList";

export default function DayOverviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Grid container spacing={2} style={{ height: "calc(100% + 16px - 7rem)" }}>
      {/* Side Bar */}
      <Grid item sx={{ display: { xl: "block", xs: "none" } }} xl={3}>
        <Item className="h-full">
          <ProjectOverviewList></ProjectOverviewList>
        </Item>
      </Grid>

      {/* Today Calendar View */}
      <Grid item xs={12} md={8} xl={6} className="">
        <Item className="h-full">
          <Paper elevation={3} className="p-5 rounded-xl h-full">
            {children}
          </Paper>
        </Item>
      </Grid>

      {/* Task Side Panel */}
      <Grid item sx={{ display: { md: "block", xs: "none" } }} md={4} xl={3}>
        <Item className="h-full">
          <Paper elevation={3} className="p-5 rounded-xl h-full">
            <TasksView />
          </Paper>
        </Item>
      </Grid>
    </Grid>
  );
}
