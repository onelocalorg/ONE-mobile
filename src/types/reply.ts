import { DateTime } from "luxon";
import { OneUser } from "./one-user";

export interface Reply {
  key: string;
  postDate: DateTime;
  commenter: OneUser;
  content: string;
  gratis: number;
}
