import { queryOptions, useQueryClient } from "@tanstack/react-query";
import { StripePaymentInfo } from "~/types/stripe-payment-info";
import { Subscription } from "~/types/subscription";
import { SubscriptionPlan } from "~/types/subscription-plan";
import { useApiService } from "./ApiService";

export enum SubscriptionMutations {
  subscribe = "subscribe",
  unsubscribe = "unsubscribe",
}

export function useSubscriptionService() {
  const queryClient = useQueryClient();

  // This API only returns the products / prices (aka subscriptions), not
  // the actual "subscription" to a product, because that is returned as
  // part of the Me (UserProfile) object
  const queries = {
    all: () => ["subscriptions"],
    lists: () => [...queries.all(), "list"],
    plans: () =>
      queryOptions({
        queryKey: [...queries.lists(), "plans"],
        queryFn: () => getPlans(),
      }),
    subscriptions: () =>
      queryOptions({
        queryKey: [...queries.lists(), "subscriptions"],
        queryFn: () => getSubscriptions(),
      }),
  };

  queryClient.setMutationDefaults([SubscriptionMutations.subscribe], {
    mutationFn: (subscriptionId: string) => {
      return subscribe(subscriptionId);
    },
  });

  queryClient.setMutationDefaults([SubscriptionMutations.unsubscribe], {
    mutationFn: (subscriptionId: string) => {
      return unsubscribe(subscriptionId);
    },
  });

  const { doGet, doPost } = useApiService();

  const getPlans = () => {
    return doGet<SubscriptionPlan[]>(`/v3/subscriptions/plans?type[]=host`);
  };

  const getSubscriptions = () => {
    return doGet<Subscription[]>(`/v3/subscriptions`);
  };

  const subscribe = (priceId: string) =>
    doPost<StripePaymentInfo>(`/v3/subscriptions`, {
      priceId,
    });

  const unsubscribe = (subscriptionId: string) =>
    doPost(`/v3/subscriptions/${subscriptionId}/unsubscribe`);

  return {
    queries,
  };
}
