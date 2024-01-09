import AbstractTrackService from "./AbstractTrackService";
import Event from "../../models/Event";
import Project from "@/models/Project";

export default class TogglTrack extends AbstractTrackService {
  hasSession: boolean = false;

  public async authenticate(originPath?: string): Promise<void> {
    const response = await fetch(
      "https://api.track.toggl.com/api/v9/me/sessions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Basic " +
            btoa(process.env.NEXT_PUBLIC_TOGGL_API_TOKEN + ":api_token"),
        },
        credentials: "include",
      }
    );
    if (response.ok) {
      this.hasSession = true;
    } else {
      console.warn("Failed to authenticate toggl");
      this.hasSession = false;
    }
  }

  public isAuthenticated(): boolean {
    return this.hasSession;
  }

  public async logout(): Promise<void> {
    if (!this.isAuthenticated()) {
      await this.authenticate();
    }

    await fetch("https://api.track.toggl.com/api/v9/me/sessions", {
      method: "DELETE",
      credentials: "include",
    });
    this.hasSession = false;
  }

  public async getAllActivitiesBetweenDates(
    start: Date,
    end: Date
  ): Promise<Event[]> {
    if (!this.isAuthenticated()) {
      await this.authenticate();
    }

    const response = await fetch(
      "https://api.track.toggl.com/api/v9/me/time_entries",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Basic " +
            btoa(process.env.NEXT_PUBLIC_TOGGL_API_TOKEN + ":api_token"),
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      if (response.status === 403 || response.status === 401) {
        // try to refresh session
        //await authorize();
        //return await getCurrentlyTracking();
      }
      return [];
    }

    const togglEntries = await response.json();

    const projectMap = await this.getAllProjectsMap();

    return togglEntries.map((togglEntry: any) => {
      const project: Project | undefined = projectMap.get(
        togglEntry.project_id
      );

      const endDate: Date = togglEntry.stop
        ? new Date(togglEntry.stop)
        : new Date();

      return {
        name: togglEntry.description,
        start: new Date(togglEntry.start),
        end: endDate,
        project: project,
      };
    });
  }

  public async getAllProjectsMap(): Promise<Map<number, Project>> {
    const workspace_id = process.env.NEXT_PUBLIC_TOGGL_WORKSPACE_ID;

    const response = await fetch(
      `https://api.track.toggl.com/api/v9/workspaces/${workspace_id}/projects?active=true`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Basic " +
            btoa(process.env.NEXT_PUBLIC_TOGGL_API_TOKEN + ":api_token"),
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch toggl projects");
    }

    const togglProjects = await response.json();

    return togglProjects.reduce(
      (map: Map<number, Project>, togglProject: any) => {
        map.set(togglProject.id, {
          id: togglProject.id,
          name: togglProject.name,
          color: togglProject.color,
        });
        return map;
      },
      new Map<number, Project>()
    );
  }

  public async getAllProjectsList(): Promise<Project[]> {
    const project_map = await this.getAllProjectsMap();

    return Array.from(project_map.values());
  }

  public async getCurrentActivity(): Promise<Event | null> {
    const response = await fetch(
      "https://api.track.toggl.com/api/v9/me/time_entries/current",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Basic " +
            btoa(process.env.NEXT_PUBLIC_TOGGL_API_TOKEN + ":api_token"),
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      if (response.status === 403 || response.status === 401) {
        // try to refresh session
        //await authorize();
        //return await getCurrentlyTracking();
      }
      return null;
    }

    const togglEntry = await response.json();

    if (!togglEntry) {
      return null;
    }

    const projectMap = await this.getAllProjectsMap();
    const project = projectMap.get(togglEntry.project_id);

    const event: Event = {
      name: togglEntry.description,
      start: new Date(togglEntry.start),
      end: null,
      project: project,
    };

    return event;
  }
}
