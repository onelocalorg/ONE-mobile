import AsyncStorage from "@react-native-async-storage/async-storage";
import { LOG } from "~/config";
import { PaginatedResponse } from "~/types/paginated-response";

// Perform a GET against the given url and return the resource generated via
// the given transform fundction
export async function doGet<Resource>(
  url: string,
  transform?: (data: any) => Resource
) {
  return callApi<Resource>("GET", url, undefined, transform);
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
  return callApi<PaginatedResponse<Resource>>("POST", url, body, (json) => ({
    pageInfo: {
      page: json.page,
      limit: json.limit,
      totalPages: json.totalPages,
      totalResults: json.totalResults,
    },
    results: json.data.results.map(transform),
  }));
}

export async function doDelete<Resource>(url: string) {
  return callApi<Resource>("DELETE", url);
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
  if (response.status < 500) {
    const json = await response.json();
    const result = {
      ...json,
      data: json.data && transform ? transform(json.data) : json.data,
    };
    LOG.debug("<=", result);
    return result as ApiResponse<Resource>;
  } else {
    LOG.error("<=", response.statusText);
    return {
      success: false,
      code: response.status,
      message: response.statusText || "Internal server error",
    };
  }
}
