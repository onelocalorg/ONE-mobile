import { useMutation } from "@tanstack/react-query";
import { onCreateTicket } from "~/network/api/services/event-service";

export const useCreateTicket = () => {
  const mutate = useMutation(onCreateTicket);

  return mutate;
};
