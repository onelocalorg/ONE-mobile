import { useMutation } from "@tanstack/react-query";
import { onEditTicket } from "~/network/api/services/home-service";

export const useEditTicket = () => {
  const mutate = useMutation(onEditTicket);

  return mutate;
};
