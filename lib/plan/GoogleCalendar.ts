import Event from "@/models/Event";
import EventGroup from "@/models/EventGroup";
import AbstractPlanService from "./AbstractPlanService";

export default class GoogleCalendar extends AbstractPlanService {
  /**
   * Redirects the user to the Google OAuth 2.0 endpoint to sign in and grant access to the app.
   */
  public authenticate(originPath: string): void {
    if (!GoogleCalendar._getAccessTokenFromBrowserMemory()) {
      // reauthenticate
      localStorage.removeItem("access_token");
    }

    GoogleCalendar._redirectToAuthenticate(originPath);
  }

  public isAuthenticated(): boolean {
    return GoogleCalendar._getAccessTokenFromBrowserMemory() !== null;
  }

  /**
   *
   * @param start
   * @param end
   * @returns
   */
  public async getAllEventsBetweenDates(
    start: Date,
    end: Date
  ): Promise<Event[]> {
    const calendars = await GoogleCalendar.getCalendars();

    const promises = calendars.map((calendar) => {
      return GoogleCalendar.getEventsBetweenDatesForCalendar(
        calendar.id,
        start,
        end
      );
    });

    const allEvents = (await Promise.all(promises)).flat();

    return allEvents;
  }

  public static get scopes() {
    return GoogleCalendar._SCOPES;
  }

  private static _REDIRECT_URI = "http://localhost:3000/auth"; // TODO load from somewhere else

  private static _SCOPES: string =
    "https://www.googleapis.com/auth/calendar.readonly " +
    "https://www.googleapis.com/auth/tasks.readonly";

  private static _getAccessTokenFromBrowserMemory(): string | null {
    const accessToken = localStorage.getItem("access_token");

    if (accessToken) {
      return accessToken;
    } else {
      console.log("Access token not found in local storage");
      return null;
    }
  }

  /**
   * Opens a new tab for the user to sign in to Google and grant access to the app.
   *
   * Follows the steps outlined in the Google Calendar API Quickstart guide:
   * https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow#obtainingaccesstokens
   */
  private static _redirectToAuthenticate(originPath: string): void {
    if (GoogleCalendar._getAccessTokenFromBrowserMemory()) {
      return;
    }

    // Google's OAuth 2.0 endpoint for requesting an access token
    var oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";

    const params = {
      client_id: process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID || "",
      redirect_uri: GoogleCalendar._REDIRECT_URI,
      response_type: "token",
      scope: GoogleCalendar._SCOPES,
      include_granted_scopes: "true",
      state: originPath,
    };

    // Create <form> element to submit parameters to OAuth 2.0 endpoint.
    var form = document.createElement("form");
    form.setAttribute("method", "GET"); // Send as a GET request.
    form.setAttribute("action", oauth2Endpoint);

    // Add form parameters as hidden input values.
    for (var p in params) {
      var input = document.createElement("input");
      input.setAttribute("type", "hidden");
      input.setAttribute("name", p);
      input.setAttribute("value", params[p as keyof typeof params]);

      form.appendChild(input);
    }

    // Add form to page and submit it to open the OAuth 2.0 endpoint.
    document.body.appendChild(form);
    form.submit();
  }

  private static async getCalendars(): Promise<EventGroup[]> {
    const accessToken: string | null =
      GoogleCalendar._getAccessTokenFromBrowserMemory();

    if (!accessToken) {
      throw new Error("Not authenticated!");
    }

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/users/me/calendarList?` +
        new URLSearchParams({
          minAccessRole: "owner",
          showHidden: "false",
        }),
      {
        cache: "force-cache",
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        // try to refresh token
        throw new Error("Unauthorized");
      }
    }

    const calendarsData = await response.json();

    return calendarsData.items.map((item: any) => {
      return { name: item.summary, id: item.id, color: item.backgroundColor };
    });
  }

  private static async getEventsBetweenDatesForCalendar(
    calendarId: string,
    start: Date,
    end: Date
  ): Promise<Event[]> {
    const accessToken: string | null =
      GoogleCalendar._getAccessTokenFromBrowserMemory();

    if (!accessToken) {
      // save a request by throwin 'Unauthorized' here
      throw new Error("Unauthorized");
    }

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?` +
        new URLSearchParams({
          timeMin: start.toISOString(),
          timeMax: end.toISOString(),
          singleEvents: "true",
          orderBy: "startTime",
        }),
      {
        cache: "force-cache",
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        // try to refresh token
        throw new Error("Unauthorized");
      }
    }

    const eventsData = await response.json();

    return eventsData.items.map((item: any) => {
      return {
        name: item.summary,
        start: new Date(item.start.dateTime),
        end: new Date(item.end.dateTime),
      };
    });
  }
}
