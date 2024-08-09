import { LineItem } from "./line-item";
import { PriceBreakdown } from "./price-breakdown";

export interface Order extends OrderData {
  id: string;
  costs: PriceBreakdown;
  paymentIntent?: string;
  stripe?: StripeData;
}

export interface OrderData {
  lineItems: LineItem[];
}

export interface StripeData {
  customer: string;
  publishableKey: string;
  ephemeralKey: string;
}
