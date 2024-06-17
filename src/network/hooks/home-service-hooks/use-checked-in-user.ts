import { useMutation } from "@tanstack/react-query";
import { onCheckedInUser } from "~/network/api/services/useEventService";

export const useCheckedInUser = () => {
  const mutate = useMutation(onCheckedInUser);

  return mutate;
};
