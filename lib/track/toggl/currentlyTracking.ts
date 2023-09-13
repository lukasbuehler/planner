import Event from "../../../models/Event";

export async function getCurrentlyTracking(): Promise<Event | null> {
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
