import { PostUpdateData } from "./post-update-data";

// The data for creating a post
export interface PostData extends PostUpdateData {
  name: string;
}
