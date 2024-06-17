import { useMutation } from "@tanstack/react-query";
import { onSaveCustomerId } from "~/network/api/services/useUserService";

export const useSaveCustomerId = () => {
  const mutate = useMutation(onSaveCustomerId);

  return mutate;
};
