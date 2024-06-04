import { useMutation } from "@tanstack/react-query";
import { login } from "~/network/api/services/user-service";

export const useLogin = () => {
  const mutate = useMutation(login);

  return mutate;
};
