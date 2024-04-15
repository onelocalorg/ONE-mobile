import { onPurchaseTicket } from "@network/api/services/home-service";
import { useMutation } from "@tanstack/react-query";

export const usePurchaseTicket = () => {
  const mutate = useMutation(onPurchaseTicket);

  return mutate;
};
