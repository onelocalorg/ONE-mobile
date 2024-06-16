import { queryOptions } from "@tanstack/react-query";

export function userProfile(id: string) {
  return queryOptions({
    queryKey: ["getUserProfile", id],
    queryFn: () => getUserProfile(id),
  });
}
