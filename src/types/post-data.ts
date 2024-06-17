import { PostUpdateData } from "./post-update-data";

export enum PostType {
  REQUEST = "request",
  OFFER = "offer",
  GRATIS = "gratis",
}

// The data for creating a post
export interface PostData extends PostUpdateData {
  name: string;
  details: string;
}
