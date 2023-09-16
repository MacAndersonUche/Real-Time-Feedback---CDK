export interface Feedback {
  id: string;
  author: string;
  email: string;
  feedbacktext: string;
  status: Status;
}

export enum Status {
  Submited = "Submited",
  Actioned = "Actioned",
}
export type SubmittedByUser = Omit<Feedback, "id" | "status">;

export interface genericJSON {
  [key: string]: any;
}
