import { useMutation } from "@tanstack/react-query";
import { onCreateStripeCustomer } from "~/network/api/services/payment-service";

export const useCreateStripeCustomer = () => {
  const mutate = useMutation(onCreateStripeCustomer);

  return mutate;
};
