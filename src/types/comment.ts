import { DateTime } from "luxon";
import { OneUser } from "./one-user";
import { Reply } from "./reply";

export interface Comment {
  id: string;
  post: string;
  postDate: DateTime;
  author: OneUser;
  content: string;
  gratis: number;
  replies: Reply[];
}
