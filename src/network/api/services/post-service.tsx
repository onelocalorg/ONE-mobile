import { DateTime } from "luxon";
import { LOG } from "~/config";
import { Post } from "~/types/post";
import { PostData } from "~/types/post-data";
import { User } from "~/types/user";
import { doPost, doPostPaginated } from "./api-service";

export async function createPost(data: PostData) {
  const resp = await doPost<CreatePostApiResource, PostWrappedInUselessPost>(
    "/v1/posts/create",
    postToApi(data)
  );
  return { ...resp, data: apiToPost(resp.data.post) };
}

export async function updatePost(id: string, data: PostData) {
  try {
    const resp = await doPost<CreatePostApiResource, PostWrappedInUselessPost>(
      `/v2/posts/update/${id}`,
      postToApi(data)
    );
    return { ...resp, data: apiToPost(resp.data.post) };
  } catch (e) {
    console.log(e);
    LOG.error(e);
    throw e;
  }
}

export async function deletePost(id: string) {
  return doPost<never, never>(`/v2/posts/delete/${id}`);
}

export async function listPosts() {
  const resp = await doPostPaginated<never, GetPostApiResource>(
    "/v1/posts/list?limit=10"
  );
  return { pageInfo: resp.pageInfo, posts: resp.results.map(apiToPost) };
}

// The JSON sent for an API call
interface CreatePostApiResource {
  type: string;
  what_name: string;
  where_address?: string;
  where_lat?: string;
  where_lng?: string;
  startDate?: string;
  hasStartTime?: boolean;
  content?: string;
  post_image?: string[];
}

interface PostWrappedInUselessPost {
  post: GetPostApiResource;
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
  user_id: User;
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

const postToApi = (data: PostData) =>
  ({
    type: data.type.toLowerCase(),
    what_name: data.name,
    where_address: data.address,
    where_lat: data.latitude?.toString(),
    where_lng: data.longitude?.toString(),
    startDate: data.startDate?.toISO(),
    hasStartTime: data.hasStartTime,
    content: data.details,
    post_image: data.imageUrls,
  } as CreatePostApiResource);
