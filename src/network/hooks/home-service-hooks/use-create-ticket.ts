import { onCreateTicket } from "~/network/api/services/home-service";
import { useMutation } from "@tanstack/react-query";

export const useCreateTicket = () => {
  const mutate = useMutation(onCreateTicket);

  return mutate;
};
