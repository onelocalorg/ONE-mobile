import { onSaveCustomerId } from "@network/api/services/user-service";
import { useMutation } from "@tanstack/react-query";

export const useSaveCustomerId = () => {
  const mutate = useMutation(onSaveCustomerId);

  return mutate;
};
