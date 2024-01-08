import AbstractTrackService from "./AbstractTrackService";
import Event from "../../models/Event";

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

    return togglEntries.map((togglEntry: any) => {
      const endDate: Date = togglEntry.stop
        ? new Date(togglEntry.stop)
        : new Date();

      return {
        name: togglEntry.description,
        start: new Date(togglEntry.start),
        end: endDate,
        project: togglEntry.project_id, //getProjectNameFromId(togglEntry.project_id)
      };
    });
  }

  public getAllProjects(): any {
    // TODO implement
    return null;
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

    const event: Event = {
      name: togglEntry.description,
      start: new Date(togglEntry.start),
      end: null,
      project: "", //getProjectNameFromId(togglEntry.project_id)
    };

    return event;
  }
}
