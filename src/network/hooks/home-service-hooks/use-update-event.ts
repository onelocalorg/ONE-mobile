import { onUpdateEvent } from "@network/api/services/home-service";
import { useMutation } from "@tanstack/react-query";

export const useUpdateEvent = () => {
  const mutate = useMutation(onUpdateEvent);

  return mutate;
};
