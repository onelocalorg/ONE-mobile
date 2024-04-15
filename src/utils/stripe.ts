// import { STRIPE_PUBLIC_KEY } from "@network/constant";
import { initStripe } from "@stripe/stripe-react-native";

const stripeConfig = {
  publishableKey: process.env.STRIPE_PUBLIC_KEY!,
};

export const initializeStripe = () => {
  initStripe(stripeConfig);
};
