import { methods } from "~/network/constant";

export const getMethod = (request: { method: string }) => {
  switch (request.method) {
    case methods.get:
      return "onGet";
    case methods.post:
      return "onPost";
    default:
      return "onGet";
  }
};
