import { Post } from "./post";
import { Reply } from "./reply";

// The data returned from the server for a post
export interface PostDetail extends Post {
  replies: Reply[];
}
