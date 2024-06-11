import _ from "lodash/fp";
import { DateTime } from "luxon";
import { Comment } from "~/types/comment";
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
  location?: GeoJSON.Point;
  address?: string;
  numGrats: number;
  startDate?: string;
  postDate: string;
  timeOffset: string;
  hasStartTime?: boolean;
  details?: string;
  images: string[];
  comments: string[];
  numComments: number;
  tags: string[];
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
  // post_image: data.imageUrls,
});

export const sendGratis = (postId: string, points: number) =>
  doPost<PostGratis>("/v1/posts/gratis-sharing", { postId, points });

export const createComment = (postId: string, content: string) =>
  doPost<Comment>(
    `/v1/posts/${postId}/comments/create`,
    { content },
    resourceToComment
  );

export const createReplyToComment = (
  postId: string,
  commentId: string,
  content: string
) =>
  doPost<Comment>(
    `/v1/posts/${postId}/comments/create`,
    { content, comment_id: commentId },
    resourceToComment
  );

export const listComments = (postId: string) =>
  doPost<Comment[]>(
    `/v1/comments?post_id=${postId}`,
    undefined,
    pagedResourceToComments
  );

const resourceToComment = (c: any) =>
  ({
    ..._.omit(["reply", "date", "postDate"], c),
    postDate: DateTime.fromISO(c.postDate),
    replies:
      c.reply?.map((r: any) => ({
        ..._.omit(["date", "postDate"], r),
        postDate: DateTime.fromISO(r.postDate),
      })) ?? [],
  } as Comment);

const pagedResourceToComments = (data: any) =>
  data.results.map(resourceToComment);
