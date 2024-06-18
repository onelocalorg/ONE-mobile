import { DateTime } from "luxon";
import { OneUser } from "./one-user";

export interface Reply {
  id: string;
  parent?: string;
  post: string;
  comment: string;
  postDate: DateTime;
  author: OneUser;
  content: string;
  gratis: number;
}
