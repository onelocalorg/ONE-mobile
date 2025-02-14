export interface StripePaymentInfo {
  paymentIntent: string;
  stripe: {
    customer: string;
    publishableKey: string;
    ephemeralKey: string;
  };
}
