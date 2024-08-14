import { useQueryClient } from "@tanstack/react-query";
import { LineItem, LineItemTypes } from "~/types/line-item";
import { Order, OrderData, StripeData } from "~/types/order";
import { PriceBreakdown } from "~/types/price-breakdown";
import { handleApiError } from "~/utils/common";
import { useApiService } from "./ApiService";

export enum OrderMutations {
  createOrder = "createOrder",
}

export function useOrderService() {
  const queryClient = useQueryClient();

  const queries = {
    all: () => ["events"],
    lists: () => [...queries.all(), "list"],
  };

  queryClient.setMutationDefaults([OrderMutations.createOrder], {
    mutationFn: (data: OrderData) => {
      return createOrder(data);
    },
    onSuccess: (result: Order) => {
      void queryClient.invalidateQueries({ queryKey: queries.all() });
      void queryClient.invalidateQueries({
        queryKey: ["events", "details", result.lineItems[0].event.id],
      });
    },
    onError(error: Error) {
      handleApiError("creating Order", error);
    },
  });

  const { doPost } = useApiService();

  interface CreateOrderProps {
    lineItems: LineItem[];
  }
  const createOrder = ({ lineItems }: CreateOrderProps) => {
    const body = {
      lineItems: lineItems.map((li) => ({
        ...li,
        type: li.type.toString(),
        event: li.event.id,
        ticketType: li.ticketType.id,
      })),
    };
    return doPost<Order>(`/v3/orders/`, body, apiToOrder(lineItems));
  };

  interface LineItemResource {
    type: string;
    quantity: number;
    event: string;
    ticketType: string;
  }

  interface OrderResource {
    id: string;
    user: string;
    paymentIntent?: string;
    lineItems: LineItemResource[];
    costs: PriceBreakdown;
    stripe?: StripeData;
  }

  const apiToOrder = (lineItems: LineItem[]) => (data: OrderResource) =>
    ({
      ...data,
      lineItems: data.lineItems.map((liResource) => ({
        ...liResource,
        type: LineItemTypes.TICKET,
        event: lineItems.find((li) => li.event.id === liResource.event)?.event,
        ticketType: lineItems.find(
          (li) => li.ticketType.id === liResource.ticketType
        )?.ticketType,
      })),
      // timestamp: DateTime.fromISO(data.timestamp),
    } as Order);
}
