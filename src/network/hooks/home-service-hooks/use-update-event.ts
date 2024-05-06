import { useMutation } from "@tanstack/react-query";
import { onUpdateEvent } from "~/network/api/services/home-service";

export const useUpdateEvent = () => {
  const mutate = useMutation(onUpdateEvent);

  return mutate;
};
