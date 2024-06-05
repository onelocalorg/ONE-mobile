import { DateTime } from "luxon";
import { OneUser } from "~/types/one-user";
import { Post } from "~/types/post";
import { PostData } from "~/types/post-data";
import { PostGratis } from "~/types/post-gratis";
import { PostUpdateData } from "~/types/post-update-data";
import { doGetList, doPost } from "./api-service";

export async function createPost(data: PostData) {
  return doPost<Post>("/v1/posts/create", postToBody(data), resourceToPost);
}

export async function updatePost(id: string, data: PostUpdateData) {
  return doPost<Post>(`/v2/posts/update/${id}`, postToBody(data), (data) =>
    resourceToPost(data.post)
  );
}

export async function deletePost(id: string) {
  return doPost<never>(`/v2/posts/delete/${id}`);
}

// TODO 'start' is for pagination
export async function listPosts(numPosts: number = 20, start?: string) {
  return doGetList(`/v2/posts?limit=${numPosts}`, resourceToPost);
}

// The JSON returned from the API call
interface GetPostApiResource {
  id: string;
  type: string;
  name: string;
  author: OneUser;
  numGrats: number;
  startDate?: string;
  postDate: string;
  timeOffset: string;
  hasStartTime?: boolean;
  content?: string;
  images: string[];
  comments: string[];
  numComments: number;
}

const resourceToPost = (data: GetPostApiResource) =>
  ({
    ...data,
    startDate: data.startDate ? DateTime.fromISO(data.startDate) : undefined,
    postDate: DateTime.fromISO(data.postDate),
  } as Post);

const postToBody = (data: PostUpdateData) => ({
  type: data.type.toLowerCase(),
  what_name: data.name,
  where_address: data.address,
  where_lat: data.latitude,
  where_lng: data.longitude,
  startDate: data.startDate?.toISO(),
  hasStartTime: data.hasStartTime ?? false,
  content: data.details,
  // post_image: data.imageUrls,
});

export const sendGratis = (postId: string, points: number) =>
  doPost<PostGratis>("/v1/posts/gratis-sharing", { postId, points });
