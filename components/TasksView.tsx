import { Box, Checkbox, FormControlLabel } from "@mui/material";
import Typography from "@mui/material/Typography";

export default function TasksView() {
  return (
    <Box>
      <Typography variant="h5" className="mb-3">
        Tasks
      </Typography>

      <Box className="flex flex-col">
        <FormControlLabel
          control={<Checkbox defaultChecked />}
          label="Task 1"
        />
        <FormControlLabel
          control={<Checkbox defaultChecked />}
          label="Task 2"
        />
      </Box>
    </Box>
  );
}
