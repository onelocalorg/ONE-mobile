import { useMutation } from "@tanstack/react-query";
import { onPurchaseTicket } from "~/network/api/services/event-service";

export const usePurchaseTicket = () => {
  const mutate = useMutation(onPurchaseTicket);

  return mutate;
};
