import { AxiosResponse } from "axios";

export const getApiResponse = (data: AxiosResponse) => {
  const { success, data: resData, message, code } = data?.data || {};

  const res = {
    success,
    data: resData,
    message,
    statusCode: code,
    headers: data?.headers,
  };

  return res;
};

export type APIResponseType = ReturnType<typeof getApiResponse>;
