import { LineItem, LineItemTypes } from "~/types/line-item";
import { Order } from "~/types/order";
import { PriceBreakdown } from "~/types/price-breakdown";
import { doPost } from "./api-service";

export async function createOrder(lineItems: LineItem[]) {
  const body = {
    lineItems: lineItems.map((li) => ({
      ...li,
      type: li.type.toString(),
      event: li.event.id,
      ticketType: li.ticketType.id,
    })),
  };
  const resp = await doPost<CreateOrderBody, OrderResource>(
    `/v1/orders/`,
    body
  );
  return { ...resp, data: apiToOrder(resp.data, lineItems) };
}

interface CreateOrderBody {
  lineItems: LineItemResource[];
}

interface LineItemResource {
  type: string;
  quantity: number;
  event: string;
  ticketType: string;
}

interface OrderResource {
  id: string;
  user: string;
  paymentIntent: string;
  lineItems: LineItemResource[];
  costs: PriceBreakdown;
  stripe: {
    customer: string;
    publishableKey: string;
    ephemeralKey: string;
  };
}

const apiToOrder = (data: OrderResource, lineItems: LineItem[]) =>
  ({
    ...data,
    lineItems: data.lineItems.map((liResource) => ({
      ...liResource,
      type: LineItemTypes.TICKET,
      event: lineItems.find((li) => li.event.id === liResource.event)?.event,
      ticketType: lineItems.find((li) => li.event.id === liResource.event)
        ?.ticketType,
    })),
    // timestamp: DateTime.fromISO(data.timestamp),
  } as unknown as Order);
