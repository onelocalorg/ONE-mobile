import { DateTime } from "luxon";
import { ImageKey, ImageUrl } from "./image-info";
import { LocalEvent } from "./local-event";
import { Mappable } from "./mappable";
import { OneUser } from "./one-user";
import { Reply } from "./reply";

export enum PostType {
  REQUEST = "request",
  OFFER = "offer",
  GRATIS = "gratis",
}

export interface PostDetail extends Post {
  replies: Reply[];
}

export interface MappablePost extends Post, Mappable {
  coordinates: number[];
}

// The data returned from the server for a post
export interface Post extends PostData {
  id: string;
  gratis: number;
  author: OneUser;
  postDate: DateTime;
  images: [ImageUrl];
  numReplies: number;
  timezone: string;
}

export interface PostData extends Omit<PostUpdateData, "id"> {
  name: string;
  details: string;
}

export interface PostUpdateData {
  id: string;
  type: PostType;
  name?: string;
  details?: string;
  address?: string;
  venue?: string;
  coordinates?: number[];
  startDate?: DateTime;
  timezone?: string;
  images?: [ImageKey];
}

export const isPost = (item: LocalEvent | Post) => "author" in item;
