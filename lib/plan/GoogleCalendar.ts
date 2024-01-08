import Event from "@/models/Event";
import EventGroup from "@/models/EventGroup";
import AbstractPlanService from "./AbstractPlanService";
import {
  hasGrantedAllScopesGoogle,
  googleLogout,
  useGoogleLogin,
} from "@react-oauth/google";

export default class GoogleCalendar extends AbstractPlanService {
  login = useGoogleLogin({
    flow: "implicit",
    onSuccess: async (credentialResponse) => {
      this.handleAuthResponse(credentialResponse);

      console.log("success login");
    },
    onError: (errorResponse) => console.log(errorResponse),
  });

  public authenticate(originPath?: string): void {
    // if (this.isAuthenticated()) {
    //   this.logout();
    // }

    this.login();
  }

  public isAuthenticated(): boolean {
    return GoogleCalendar._getAccessTokenFromBrowserMemory() !== null;
  }

  public logout(): void {
    localStorage.removeItem("access_token");
    googleLogout();
    console.log("Successfully logged out");
  }

  public handleAuthResponse(response: any): void {
    console.log(response);
    if (!response.access_token) {
      throw new Error("No access token found in response");
    } else {
      const scopeArr: string[] = GoogleCalendar.scopes.split(" ");

      const hasAccess = hasGrantedAllScopesGoogle(
        response,
        "https://www.googleapis.com/auth/calendar.readonly"
      );

      if (!hasAccess) {
        throw new Error("Not all scopes granted");
      }

      localStorage.setItem("access_token", response.access_token);
      console.log("Successfully authenticated");
    }
  }

  /**
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
          Authorization: "Bearer " + accessToken,
        },
      }
    );

    if (!response.ok) {
      console.error(response);
      if (response.status === 401) {
        // try to refresh token
        throw new Error("Unauthorized");
      }
    }

    console.log("Successful calendar request");
    console.log(response);

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

    console.log(response);

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
