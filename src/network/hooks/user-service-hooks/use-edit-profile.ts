import {onEditUserProfile} from '@network/api/services/user-service';
import {useMutation} from '@tanstack/react-query';

export const useEditProfile = () => {
  console.log('-------------3333---------')
  const mutate = useMutation(onEditUserProfile);

  return mutate;
};
