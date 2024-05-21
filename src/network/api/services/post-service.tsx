import AsyncStorage from "@react-native-async-storage/async-storage";
import { DateTime } from "luxon";
import { LOG } from "~/config";
import { Post } from "~/types/post";
import { PostData } from "~/types/post-data";
import { User } from "~/types/user";

export async function createPost(data: PostData) {
  return doPost("/v1/posts/create", JSON.stringify(postToApi(data)));
}

export async function updatePost(id: string, data: PostData) {
  LOG.debug("updatePost", id, data);
  const body = postToApi(data);
  LOG.debug("body", body);
  return doPost(`/v2/posts/update/${id}`, JSON.stringify(body));
}

class ApiError extends Error {
  constructor(data: ApiResponse) {
    super(`${data.code}: ${data.message}`);
  }
}

interface ApiResponse {
  success: boolean;
  code: number;
  message: string;
  data: any;
}

async function callServer(method: string, url: string, body?: string) {
  LOG.info("callServer", method, url);
  const token = await AsyncStorage.getItem("token");
  const response = await fetch(process.env.API_URL + url, {
    method,
    headers: new Headers({
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
      Accept: "application/json",
    }),
    body,
  });
  LOG.info(response.status);
  const data = (await response.json()) as ApiResponse;
  if (response.ok) {
    LOG.debug("=> ", data);
    return data;
  } else {
    LOG.error("=>", data);
    throw new ApiError(data);
  }
}

async function doPost(url: string, body?: string) {
  return callServer("POST", url, body);
}

async function doDelete(url: string) {
  return callServer("DELETE", url);
}

export async function deletePost(id: string) {
  return doPost(`/v2/posts/delete/${id}`);
}

export async function listPosts() {
  const json = await doPost("/v1/posts/list?limit=10");
  const posts = json.data.results.map(apiToPost) as Post[];
  const { page, limit, totalPages, totalResults } = json.data;
  return {
    pageInfo: { page, limit, totalPages, totalResults },
    posts,
  } as PostResponse;
}

interface PostResponse {
  pageInfo: PageData;
  posts: Post[];
}

interface PageData {
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

const apiToPost = (data: GetPostApiBody) =>
  ({
    id: data.id!,
    type: data.type,
    name: data.what.name,
    address: data.where?.address,
    latitude: data.where?.location.coordinates[1],
    longitude: data.where?.location.coordinates[0],
    startDate: data.startDate ? DateTime.fromISO(data.startDate) : undefined,
    hasTime: data.hasTime,
    details: data.content,
    imageUrls: data.post_image ?? [],
    numComments: data.comment,
    numGrats: data.gratis,
    from: data.user_id,
  } as Post);

interface CreatePostApiBody {
  type: string;
  what_name: string;
  where_address?: string;
  where_lat?: string;
  where_lng?: string;
  startDate?: string;
  hasTime?: boolean;
  content?: string;
  post_image?: string[];
}

interface GetPostApiBody {
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
  hasTime?: boolean;
  content?: string;
  post_image?: string[];
  comment: number;
  comments: string[];
}

const postToApi = (data: PostData) =>
  ({
    type: data.type,
    what_name: data.name,
    where_address: data.address,
    where_lat: data.latitude?.toString(),
    where_lng: data.longitude?.toString(),
    startDate: data.startDate?.toISO(),
    hasTime: data.hasTime,
    content: data.details,
    post_image: data.imageUrls,
  } as CreatePostApiBody);
