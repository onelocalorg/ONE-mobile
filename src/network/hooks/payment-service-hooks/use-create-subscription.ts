import { useMutation } from "@tanstack/react-query";
import { onCreateSubscription } from "~/network/api/services/payment-service";

export const useCreateSubscription = () => {
  const mutate = useMutation(onCreateSubscription);

  return mutate;
};
