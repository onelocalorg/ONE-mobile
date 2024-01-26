import {initStripe} from '@stripe/stripe-react-native';
import ActiveEnv from '@config/env/env.json';

const stripeConfig = {
  publishableKey: ActiveEnv.STRIPE_PUBLISHABLE_KEY,
};

export const initializeStripe = () => {
  initStripe(stripeConfig);
};
