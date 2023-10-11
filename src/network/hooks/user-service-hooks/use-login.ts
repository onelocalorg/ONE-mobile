import {onLogin} from '@network/api/services/user-service';
import {useMutation} from '@tanstack/react-query';

export const useLogin = () => {
  const mutate = useMutation(onLogin);

  return mutate;
};
