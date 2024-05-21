import { PostData } from "./post-data";
import { User } from "./user";

// The data returned from the server for a post
export interface Post extends PostData {
  id: string;
  imageUrls: string[];
  numComments: number;
  numGrats: number;
  from: User;
}
