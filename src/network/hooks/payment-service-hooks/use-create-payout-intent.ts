import { onCreatePayoutIntent } from "~/network/api/services/payment-service";
import { useMutation } from "@tanstack/react-query";

export const useCreatePayoutIntent = () => {
  const mutate = useMutation(onCreatePayoutIntent);

  return mutate;
};
