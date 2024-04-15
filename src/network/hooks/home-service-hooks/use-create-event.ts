import { onCreateEvent } from "~/network/api/services/home-service";
import { useMutation } from "@tanstack/react-query";

export const useCreateEvent = () => {
  const mutate = useMutation(onCreateEvent);

  return mutate;
};
