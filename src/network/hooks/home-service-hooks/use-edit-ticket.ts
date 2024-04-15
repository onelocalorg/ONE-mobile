import { onEditTicket } from "~/network/api/services/home-service";
import { useMutation } from "@tanstack/react-query";

export const useEditTicket = () => {
  const mutate = useMutation(onEditTicket);

  return mutate;
};
