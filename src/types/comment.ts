import { DateTime } from "luxon";
import { OneUser } from "./one-user";
import { Reply } from "./reply";

export interface Comment {
  id: string;
  post_id: string;
  postDate: DateTime;
  commenter: OneUser;
  content: string;
  gratis: number;
  replies: Reply[];
}
