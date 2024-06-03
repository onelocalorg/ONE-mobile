import { DateTime } from "luxon";
import { OneUser } from "~/types/one-user";
import { Post } from "~/types/post";
import { PostData } from "~/types/post-data";
import { doPost, doPostPaginated } from "./api-service";

export async function createPost(data: PostData) {
  return doPost<Post>("/v1/posts/create", postToBody(data), apiToPost);
}

export async function updatePost(id: string, data: PostData) {
  return doPost<Post>(`/v2/posts/update/${id}`, postToBody(data), apiToPost);
}

export async function deletePost(id: string) {
  return doPost<never>(`/v2/posts/delete/${id}`);
}

export async function listPosts() {
  return doPostPaginated<Post>("/v1/posts/list?limit=50", undefined, apiToPost);
}

// The JSON returned from the API call
interface GetPostApiResource {
  id: string;
  type: string;
  what: {
    name: string;
    quantity?: number;
  };
  to?: {
    type?: string;
    name?: string;
    users?: string[];
  };
  for?: {
    quantity: number;
  };
  where?: {
    location: GeoJSON.Point;
    address: string;
  };
  user_id: OneUser;
  gratis: number;
  startDate?: string;
  postDate?: string;
  hasStartTime?: boolean;
  content?: string;
  post_image?: string[];
  comment: number;
  comments: string[];
}

const apiToPost = (data: GetPostApiResource) =>
  ({
    id: data.id!,
    type: data.type.toLowerCase(),
    name: data.what.name,
    address: data.where?.address,
    latitude: data.where?.location.coordinates[1],
    longitude: data.where?.location.coordinates[0],
    startDate: data.startDate ? DateTime.fromISO(data.startDate) : undefined,
    hasStartTime: data.hasStartTime,
    postDate: data.postDate ? DateTime.fromISO(data.postDate) : undefined,
    details: data.content,
    imageUrls: data.post_image ?? [],
    numComments: data.comment,
    numGrats: data.gratis,
    author: data.user_id,
  } as Post);

const postToBody = (data: PostData) => ({
  type: data.type.toLowerCase(),
  what_name: data.name,
  where_address: data.address,
  where_lat: data.latitude?.toString(),
  where_lng: data.longitude?.toString(),
  startDate: data.startDate?.toISO(),
  hasStartTime: data.hasStartTime ?? false,
  content: data.details,
  post_image: data.imageUrls,
});
