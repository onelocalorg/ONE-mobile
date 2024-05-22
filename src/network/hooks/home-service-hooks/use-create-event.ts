import { useMutation } from "@tanstack/react-query";
import { onCreateEvent } from "~/network/api/services/event-service";

export const useCreateEvent = () => {
  const mutate = useMutation(onCreateEvent);

  return mutate;
};
