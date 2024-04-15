import { onCreateStripeCustomer } from "~/network/api/services/payment-service";
import { useMutation } from "@tanstack/react-query";

export const useCreateStripeCustomer = () => {
  const mutate = useMutation(onCreateStripeCustomer);

  return mutate;
};
