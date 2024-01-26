import {onCreateSubscription} from '@network/api/services/payment-service';
import {useMutation} from '@tanstack/react-query';

export const useCreateSubscription = () => {
  const mutate = useMutation(onCreateSubscription);

  return mutate;
};
