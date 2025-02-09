import { LineItem } from "./line-item";
import { PriceBreakdown } from "./price-breakdown";

export interface PayableOrder extends Order {
  paymentIntent: string;
  stripe: {
    customer: string;
    publishableKey: string;
    ephemeralKey: string;
  };
}

export interface Order extends OrderData {
  id: string;
  costs: PriceBreakdown;
}

export interface OrderData {
  lineItems: LineItem[];
}

export const isPayableOrder = (
  order: Order | undefined
): order is PayableOrder | undefined =>
  !!order && Object.prototype.hasOwnProperty.call(order, "paymentIntent");
