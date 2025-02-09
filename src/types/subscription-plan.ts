export interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string;
  prices: SubscriptionPrice[];
  metadata: {
    type: "host";
  };
}

export interface SubscriptionPrice {
  id: string;
  unit_amount: number;
  currency: string;
  recurring: {
    interval: "month" | "year";
  };
}
