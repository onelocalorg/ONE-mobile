import { DateTime } from "luxon";
import { OneUser } from "./one-user";
import { PostData } from "./post-data";

// The data returned from the server for a post
export interface Post extends PostData {
  id: string;
  gratis: number;
  author: OneUser;
  postDate: DateTime;
  images: string[];
  numReplies: number;
}
