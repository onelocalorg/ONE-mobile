import { useMutation } from "@tanstack/react-query";
import { onEditTicket } from "~/network/api/services/event-service";

export const useEditTicket = () => {
  const mutate = useMutation(onEditTicket);

  return mutate;
};
