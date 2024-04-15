import { onEditUserProfile } from "@network/api/services/user-service";
import { useMutation } from "@tanstack/react-query";

export const useEditProfile = () => {
  const mutate = useMutation(onEditUserProfile);

  return mutate;
};
