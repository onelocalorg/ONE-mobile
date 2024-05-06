import { useMutation } from "@tanstack/react-query";
import { onCreatePayoutIntent } from "~/network/api/services/payment-service";

export const useCreatePayoutIntent = () => {
  const mutate = useMutation(onCreatePayoutIntent);

  return mutate;
};
