import AbstractService from "../AbstractService";
import Event from "../../models/Event";

export default abstract class AbstractTrackService extends AbstractService {
  abstract getAllActivitiesBetweenDates(
    start: Date,
    end: Date
  ): Promise<Event[]>;

  abstract getAllProjects(): Promise<any>;

  abstract getCurrentActivity(): Promise<Event | null>;
}
