import { useMutation } from "@tanstack/react-query";
import { onPurchaseTicket } from "~/network/api/services/home-service";

export const usePurchaseTicket = () => {
  const mutate = useMutation(onPurchaseTicket);

  return mutate;
};
