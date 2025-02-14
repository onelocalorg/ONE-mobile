import { queryOptions, useQueryClient } from "@tanstack/react-query";
import { Balance } from "~/types/balance";
import { StripePayout } from "~/types/stripe-payout";
import { useApiService } from "./ApiService";

export enum PayoutMutations {
  createPayout = "createPayout",
}

export function usePayoutService() {
  const queryClient = useQueryClient();

  const queries = {
    all: () => ["payouts"],
    balance: () =>
      queryOptions({
        queryKey: [...queries.all(), "balance"],
        queryFn: () => getBalance(),
        staleTime: 5000,
      }),
  };

  queryClient.setMutationDefaults([PayoutMutations.createPayout], {
    mutationFn: (amount: number) => {
      return createPayout(amount);
    },
  });

  const { doGet, doPost } = useApiService();

  const getBalance = () => doGet<Balance>(`/v3/payouts/balance`);

  const createPayout = (amount: number) => {
    return doPost<StripePayout>(`/v3/payouts`, {
      amount,
    });
  };

  return {
    queries,
  };
}
