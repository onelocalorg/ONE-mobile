import { useQueryClient } from "@tanstack/react-query";
import _ from "lodash/fp";
import { DateTime } from "luxon";
import { ReactNode, createContext, useContext } from "react";
import { Alert } from "react-native";
import { LOG } from "~/config";
import { AuthDispatchContext, useAccessToken } from "~/navigation/AuthContext";
import { ApiError } from "~/types/api-error";
import { mapValues } from "~/utils/common";

interface IApiService {
  doGet: <R>(url: string, transform?: (data: any) => R) => Promise<R>;
  doPost: <R>(
    url: string,
    body?: any,
    transform?: (data: any) => R
  ) => Promise<R>;
  // doPostList: <R>(url: string, transform?: (data: any) => R) => Promise<R[]>;
  doDelete: <R>(url: string, transform?: (data: any) => R) => Promise<R>;
  doPatch: <R>(
    url: string,
    body?: any,
    transform?: (data: any) => R
  ) => Promise<R>;
}

const ApiServiceContext = createContext<IApiService | null>(null);

export function useApiService() {
  return useContext(ApiServiceContext) as IApiService;
}

interface ApiServiceProviderProps {
  children: ReactNode;
}

export function ApiService({ children }: ApiServiceProviderProps) {
  const token = useAccessToken();
  const queryClient = useQueryClient();
  const dispatch = useContext(AuthDispatchContext);

  // queryClient.setDefaultOptions({
  //   queries: {
  //     o
  //   }
  // })
  // })

  queryClient.setMutationDefaults([], {
    onError: (err: Error) => {
      if (err instanceof ApiError && err.code === 401) {
        // The token is bad. Force signout
        // TODO Try to refresh token first
        dispatch.handleSignOut();
      } else {
        Alert.alert(`API failure: `, err.message);
      }
    },
  });

  const DATETIME_KEYS = ["startDate", "endDate", "postDate", "joinDate"];
  const NO_LOG_KEYS = [
    "password",
    "access_token",
    "refresh_token",
    "base64String",
    "messagingToken",
  ];

  const client = {
    doGet,
    doPost,
    doDelete,
    doPatch,
  };

  return (
    <ApiServiceContext.Provider value={client}>
      {children}
    </ApiServiceContext.Provider>
  );

  // Perform a GET against the given url and return the resource generated via
  // the given transform function
  async function doGet<Resource>(
    url: string,
    transform?: (data: any) => Resource
  ) {
    return callApi<Resource>("GET", url, undefined, transform);
  }

  // Perform a GET against the given url and return a list of resources generated via
  // the given transform fundtion
  // async function doGetList<Resource>(
  //   url: string,
  //   transform?: (data: any) => Resource
  // ) {
  //   return callApiAndMap<Resource>("GET", url, undefined, transform);
  // }

  // Perform a POST against the given url and return the resource generated via
  // the given transform fundction
  function doPost<Resource>(
    url: string,
    body?: any,
    transform?: (data: any) => Resource
  ) {
    return callApi<Resource>("POST", url, body, transform);
  }

  // Perform a GET against the given url and return a list of resources generated via
  // the given transform fundtion
  // function doPostList<Resource>(
  //   url: string,
  //   body?: any,
  //   transform?: (data: any) => Resource
  // ) {
  //   return callApiAndMap<Resource>("POST", url, body, transform);
  // }

  // Perform a PATCH against the given url and return the resource generated via
  // the given transform fundction
  function doPatch<Resource>(
    url: string,
    body: any,
    transform?: (data: any) => Resource
  ) {
    return callApi<Resource>("PATCH", url, body, transform);
  }

  function doDelete<Resource>(url: string) {
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
      LOG.debug(
        "=>",
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        mapValues(
          (v: string, k: string) => (NO_LOG_KEYS.includes(k) ? "<hidden>" : v),
          body
        )
      );
    }
    const response = await fetch(process.env.API_URL + url, {
      method,
      headers: new Headers({
        Authorization: token ? "Bearer " + token : "",
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

    LOG.debug("<=", hideFields(json.data));

    let resource = convertDateTimes(json.data);

    resource = transform ? transform(resource) : resource;

    return resource as Resource;
  }

  // function callApiAndMap<Resource>(
  //   method: string,
  //   url: string,
  //   body?: any,
  //   transform?: (data: any) => Resource
  // ) {
  //   return callApi<Resource[]>(method, url, body, (data) =>
  //     // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
  //     transform ? data.map(transform) : data
  //   );
  // }

  function convertDateTimes<T>(from: T): T {
    function recurse(v: unknown): unknown {
      if (_.isNumber(v) || _.isString(v)) {
        return v;
      } else if (_.isArray(v)) {
        return (v as Array<unknown>).map(recurse);
      } else {
        // it is an object
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        return mapValues((v: unknown, k: string) => {
          if (_.isArray(v)) {
            return (v as Array<unknown>).map(recurse);
          } else if (_.isNumber(v)) {
            return v;
          } else if (_.isString(v)) {
            if (DATETIME_KEYS.includes(k)) {
              return DateTime.fromISO(v);
            } else {
              return v;
            }
          } else {
            return recurse(v);
          }
        }, v);
      }
    }

    return recurse(from) as T;
  }

  // return _.isArray(from)
  //   ? from.map(convertDateTimes)
  //   : !_.isObject(from)
  //   ? from
  //   : mapValuesWithKey(
  //       (v: string, k: string) =>
  //         _.isArray(v)
  //           ? v.map(convertDateTimes)
  //           : DATETIME_KEYS.includes(k)
  //           ? DateTime.fromISO(v)
  //           : v,
  //       from
  //     );
  // }

  function hideFields(from: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return _.isArray(from)
      ? from.map(convertDateTimes)
      : // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        mapValues(
          (v: string, k: string) => (NO_LOG_KEYS.includes(k) ? "<hidden>" : v),
          from
        );
  }
}
