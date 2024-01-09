"use client";

import TogglTrack from "@/lib/track/TogglTrack";
import Project from "@/models/Project";
import { Box, Typography } from "@mui/material";
import { useState, useEffect } from "react";

interface ProjectOverviewListProps {}

export default function ProjectOverviewList({}: ProjectOverviewListProps) {
  const [projectList, setProjectList] = useState<Project[]>([]);

  useEffect(() => {
    const toggl = new TogglTrack();

    const projectList = toggl
      .getAllProjectsList()
      .then((projectList: Project[]) => {
        setProjectList(projectList);
      });
  }, []);

  return (
    <Box>
      <Typography variant="h5" className="mb-3">
        Projects
      </Typography>

      <Box className="flex flex-col px-3 pt-2">
        {projectList.map((project) => (
          <Box key={project.id} className="flex items-center mb-2">
            <Box
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: project.color }}
            ></Box>
            <Typography>{project.name}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
