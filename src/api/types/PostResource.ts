import { DateTime } from "luxon";
import { OneUser } from "~/types/one-user";
import { Post } from "~/types/post";

export interface PostResource {
  id: string;
  type: string;
  name: string;
  author: OneUser;
  coordinates?: number[];
  address?: string;
  gratis: number;
  startDate?: string;
  postDate: string;
  timeOffset: string;
  details?: string;
  images: string[];
  comments: string[];
  numComments: number;
}

export const resourceToPost = (data: PostResource) =>
  ({
    ...data,
    startDate: data.startDate ? DateTime.fromISO(data.startDate) : undefined,
    postDate: DateTime.fromISO(data.postDate),
  } as Post);
