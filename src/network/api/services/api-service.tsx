import AsyncStorage from "@react-native-async-storage/async-storage";
import _ from "lodash/fp";
import { LOG } from "~/config";
import { ApiError } from "~/types/api-error";
import { Paginated } from "~/types/paginated";

// Perform a GET against the given url and return the resource generated via
// the given transform function
export async function doGet<Resource>(
  url: string,
  transform?: (data: any) => Resource
) {
  return callApi<Resource>("GET", url, undefined, transform);
}

// Perform a GET against the given url and return a list of resources generated via
// the given transform fundtion
export async function doGetList<Resource>(
  url: string,
  transform?: (data: any) => Resource
) {
  return doList<Resource>("GET", url, undefined, transform);
}

// Perform a GET against the given url and return a list of resources generated via
// the given transform fundtion
export async function doPostList<Resource>(
  url: string,
  body?: any,
  transform?: (data: any) => Resource
) {
  return doList<Resource>("POST", url, body, transform);
}

// Perform a POST against the given url and return the resource generated via
// the given transform fundction
export async function doPost<Resource>(
  url: string,
  body?: any,
  transform?: (data: any) => Resource
) {
  return callApi<Resource>("POST", url, body, transform);
}

// Perform a PATCH against the given url and return the resource generated via
// the given transform fundction
export async function doPatch<Resource>(
  url: string,
  body: any,
  transform?: (data: any) => Resource
) {
  return callApi<Resource>("PATCH", url, body, transform);
}

export async function doPostPaginated<Resource>(
  url: string,
  body?: any,
  transform?: (data: any) => Resource
) {
  return callApi<Paginated<Resource>>("POST", url, body, (json) => ({
    pageInfo: {
      page: json.page,
      limit: json.limit,
      totalPages: json.totalPages,
      totalResults: json.totalResults,
    },
    results: json.results.map(transform),
  }));
}

export async function doDelete<Resource>(url: string) {
  return callApi<Resource>("DELETE", url);
}

interface ApiResponse<Resource> {
  success: boolean;
  code: number;
  message: string;
  data?: Resource;
}

// Returns ApiResponse<Resource>
async function callApi<Resource>(
  method: string,
  url: string,
  body?: any,
  transform?: (data: any) => Resource
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
  const json = (await response.json()) as ApiResponse<any>;
  if (!response.ok && _.isNull(json)) {
    LOG.error("<=", response.statusText);
    throw new ApiError(response.status, response.statusText);
  }

  if (!response.ok) {
    LOG.error("<=", url, json);
    throw new ApiError(json.code, json.message);
  }

  const resource = transform ? transform(json.data) : json.data;
  LOG.debug("<=", resource);
  return resource as Resource;
}

export async function doList<Resource>(
  method: string,
  url: string,
  body?: any,
  transform?: (data: any) => Resource
) {
  return callApi<Resource[]>(method, url, body, (data) =>
    transform ? data.map(transform) : data
  );
}
