import AbstractService from "../AbstractService";
import Event from "../../models/Event";

export default abstract class AbstractPlanService extends AbstractService {
  /**
   * Fetches all events from all event groups (calendars) between the given dates.
   * @param start
   * @param end
   */
  abstract getAllEventsBetweenDates(start: Date, end: Date): Promise<Event[]>;
}
