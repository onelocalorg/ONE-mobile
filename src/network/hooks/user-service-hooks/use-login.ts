import { useMutation } from "@tanstack/react-query";
import { onLogin } from "~/network/api/services/user-service";

export const useLogin = () => {
  const mutate = useMutation(onLogin);

  return mutate;
};
