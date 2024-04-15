import { onCheckedInUser } from "~/network/api/services/home-service";
import { useMutation } from "@tanstack/react-query";

export const useCheckedInUser = () => {
  const mutate = useMutation(onCheckedInUser);

  return mutate;
};
