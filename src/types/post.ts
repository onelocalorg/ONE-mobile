import { DateTime } from "luxon";
import { OneUser } from "./one-user";
import { Reply } from "./reply";

export enum PostType {
  REQUEST = "request",
  OFFER = "offer",
  GRATIS = "gratis",
}

export interface ImageInfo {
  key: string;
  url?: string;
}

export interface PostDetail extends Post {
  replies: Reply[];
}

// The data returned from the server for a post
export interface Post extends PostData {
  id: string;
  gratis: number;
  author: OneUser;
  postDate: DateTime;
  images: [ImageInfo];
  numReplies: number;
}

export interface PostData extends PostUpdateData {
  name: string;
  details: string;
}

export interface PostUpdateData {
  id: string;
  type: PostType;
  name?: string;
  details?: string;
  address?: string;
  coordinates?: number[];
  startDate?: DateTime;
  timezone?: string;
  images?: [ImageInfo];
}
