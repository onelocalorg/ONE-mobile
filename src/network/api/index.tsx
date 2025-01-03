import axios, { AxiosInstance } from "axios";
import Toast from "react-native-simple-toast";
import { apiConstants } from "~/network/constant";
import { store } from "~/network/reducers/store";

export interface ErrorResponse {
  [key: string]: {
    status: number;
    data: {
      message: string;
      data: unknown;
      path: string;
    };
  };
}

export const axiosRequestConfig = {
  method: "get", // default
  timeout: 1000 * 10, // default is `0` (no timeout)

  // `withCredentials` indicates whether or not cross-site Access-Control requests
  // should be made using credentials
  withCredentials: false, // default

  // `maxContentLength` defines the max size of the http
  // response content in bytes allowed in node.js
  maxContentLength: 2000,

  // `maxBodyLength` (Node only option) defines the max size of the http
  // request content in bytes allowed
  maxBodyLength: 2000,

  // If set to 0, no redirects will be followed.
  maxRedirects: 0, // default
};

// Add a request interceptor
axios.interceptors.request.use(
  // Do something before request is sent
  (config) => config,
  // Do something with request error
  (error) => Promise.reject(error)
);

const interceptor = (ref: AxiosInstance) => {
  ref.interceptors.response.use(
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    (response) => response,
    async (error: ErrorResponse) => {
      const { status } = error?.response || {};

      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error

      if (status === 401) {
        const user =
          (store.getState().userProfileReducer?.user as {
            refresh_token: string;
            access_token: string;
          }) || {};
        const res = await axios.post(
          `${process.env.API_URL}${apiConstants.refreshTokens}`,
          {
            refreshToken: user?.refresh_token,
          },
          {
            headers: {
              Authorization: `Bearer ${user?.access_token}`,
            },
          }
        );
        return;
      }

      if (status !== 200) {
        Toast.show(error?.response?.data?.message, Toast.LONG, {
          backgroundColor: "black",
        });
      }

      return Promise.reject(error?.response);
    }
  );
};

class APIService {
  userService!: AxiosInstance;

  homeService!: AxiosInstance;

  paymentService!: AxiosInstance;

  constructor() {
    this.initService();
  }

  async initService() {
    const userServiceUrl = process.env.API_URL;
    this.userService = axios.create({
      ...axiosRequestConfig,
      baseURL: userServiceUrl,
    });
    interceptor(this.userService);

    const homeServiceUrl = process.env.API_URL;
    this.homeService = axios.create({
      ...axiosRequestConfig,
      baseURL: homeServiceUrl,
    });
    interceptor(this.homeService);

    const paymentServiceUrl = process.env.STRIPE_BASE_URL;
    this.paymentService = axios.create({
      ...axiosRequestConfig,
      baseURL: paymentServiceUrl,
    });
    interceptor(this.paymentService);
  }
}

export const API = new APIService();
