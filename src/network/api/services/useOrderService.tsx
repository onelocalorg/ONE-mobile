import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LineItem, LineItemTypes } from "~/types/line-item";
import { Order, OrderData } from "~/types/order";
import { PriceBreakdown } from "~/types/price-breakdown";
import { Rsvp, RsvpData, RsvpType } from "~/types/rsvp";
import { handleApiError } from "~/utils/common";
import { useApiService } from "./ApiService";
import { EventMutations } from "./useEventService";

export enum OrderMutations {
  createOrder = "createOrder",
}

export function useOrderService() {
  const queryClient = useQueryClient();

  const queries = {
    all: () => ["events"],
    lists: () => [...queries.all(), "list"],
  };

  const { mutate: createRsvp } = useMutation<Rsvp, Error, RsvpData>({
    mutationKey: [EventMutations.createRsvp],
  });

  queryClient.setMutationDefaults([OrderMutations.createOrder], {
    mutationFn: (data: OrderData) => {
      return createOrder(data);
    },
    onSuccess: (order: Order) => {
      void queryClient.invalidateQueries({ queryKey: queries.all() });

      order.lineItems.forEach((li) => {
        void createRsvp({
          eventId: li.event.id,
          type: RsvpType.GOING,
        });
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
    stripe?: {
      customer: string;
      publishableKey: string;
      ephemeralKey: string;
    };
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
