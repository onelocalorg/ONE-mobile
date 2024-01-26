import {onGetSubscriptionPlans} from '@network/api/services/home-service';
import {apiKeys} from '@network/constant';
import {useQuery} from '@tanstack/react-query';

export type Root = PlanData[];

export interface PlanData {
  name: string;
  plan_id: string;
  price_id: string;
  price: Price;
  interval: string;
  id: string;
  is_active_subscription: string;
}

export interface Price {
  $numberDecimal: string;
}

const subscriptionPlansParsedData = (data: Root) => {
  return data;
};

export const useSubscriptionPlans = () => {
  const query = useQuery([apiKeys.subscriptionPlans], onGetSubscriptionPlans, {
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  return {...query, data: subscriptionPlansParsedData(query?.data?.data)};
};
