import { LineItem } from "./line-item";
import { PriceBreakdown } from "./price-breakdown";

export interface Order {
  id: string;
  costs: PriceBreakdown;
  lineItems: LineItem[];
  paymentIntent: string;
  stripe: {
    customer: string;
    publishableKey: string;
    ephemeralKey: string;
  };
}
