import AsyncStorage from "@react-native-async-storage/async-storage";
import { LOG } from "~/config";

export async function doGet<Resource>(url: string) {
  return callApi<never, Resource>("GET", url);
}

export async function doPost<Body, Resource>(url: string, body?: Body) {
  return callApi<Body, Resource>("POST", url, body);
}

export async function doPostPaginated<Body, Resource>(
  url: string,
  body?: Body
) {
  const resp = await callApi<Body, any>("POST", url, body);

  const { page, limit, totalPages, totalResults } = resp.data;

  return {
    pageInfo: { page, limit, totalPages, totalResults },
    results: resp.data.results,
  } as PaginatedResponse<Resource>;
}

export async function doDelete<Resource>(url: string) {
  return callApi<never, Resource>("DELETE", url);
}

class ApiError extends Error {
  constructor(data: ApiResponse<any>) {
    super(`${data.code}: ${data.message}`);
  }
}

interface ApiResponse<Resource> {
  success: boolean;
  code: number;
  message: string;
  data: Resource;
}

export interface PageData {
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

export interface PaginatedResponse<Resource> {
  pageInfo: PageData;
  results: Resource[];
}

async function callApi<Body, Resource>(
  method: string,
  url: string,
  body?: Body
) {
  LOG.info("callApi", method, url);
  if (body) {
    LOG.debug("=>", body);
  }
  const token = await AsyncStorage.getItem("token");
  const response = await fetch(process.env.API_URL + url, {
    method,
    headers: new Headers({
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
      Accept: "application/json",
    }),
    body: JSON.stringify(body),
  });
  LOG.info(response.status);
  const data = (await response.json()) as ApiResponse<Resource>;
  if (response.ok) {
    LOG.debug("=> ", data);
    return data;
  } else {
    LOG.error("=>", data);
    throw new ApiError(data);
  }
}
