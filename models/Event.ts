import Project from "./Project";

export default interface Event {
  name: string;
  start: Date;
  end: Date | null;
  project?: Project;
}
