import { PostUpdateData } from "./post-update-data";

export enum PostType {
  ASK = "request",
  GIVE = "offer",
  GRATIS = "gratis",
}

// The data for creating a post
export interface PostData extends PostUpdateData {
  name: string;
  details: string;
}
