import { LineItem } from "./line-item";
import { PriceBreakdown } from "./price-breakdown";

export interface Order extends OrderData {
  id: string;
  costs: PriceBreakdown;
  paymentIntent?: string;
  stripe?: {
    customer: string;
    publishableKey: string;
    ephemeralKey: string;
  };
}

export interface OrderData {
  lineItems: LineItem[];
}
