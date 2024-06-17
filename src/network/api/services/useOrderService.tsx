import { LineItem, LineItemTypes } from "~/types/line-item";
import { Order, OrderData } from "~/types/order";
import { PriceBreakdown } from "~/types/price-breakdown";
import { useApiService } from "./ApiService";

export default function OrderService() {
  const { doPost } = useApiService();

  const mutations = {
    createOrder: {
      mutationFn: (data: OrderData) => {
        return createOrder(data);
      },
      // onSuccess: (data: RsvpData) => {
      //   void queryClient.invalidateQueries({
      //     queryKey: queries.rsvps(),
      //   });
      // },
    },
  };

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

  return {
    mutations,
    createOrder,
  };
}
