import { useMutation } from "@tanstack/react-query";
import { onEditUserProfile } from "~/network/api/services/user-service";

export const useEditProfile = () => {
  const mutate = useMutation(onEditUserProfile);

  return mutate;
};
