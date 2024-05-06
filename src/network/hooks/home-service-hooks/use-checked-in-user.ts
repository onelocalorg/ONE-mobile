import { useMutation } from "@tanstack/react-query";
import { onCheckedInUser } from "~/network/api/services/home-service";

export const useCheckedInUser = () => {
  const mutate = useMutation(onCheckedInUser);

  return mutate;
};
