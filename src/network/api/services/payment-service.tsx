import {apiConstants} from '@network/constant';
import {API} from '..';
import ActiveEnv from '@config/env/env.json';

interface CreateStripeCustomerProps {
  bodyParams: {
    name: string;
    phone: string;
    description: string;
  };
}

export const onCreateStripeCustomer = async (
  props: CreateStripeCustomerProps,
) => {
  const {bodyParams} = props || {};

  let response;
  try {
    const endPoint = `${apiConstants.createStripeCustomer}`;
    const data = await API.paymentService.post(endPoint, bodyParams, {
      headers: {
        Authorization: `Bearer ${ActiveEnv.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    response = {data: data?.data, statusCode: data?.status};
  } catch (error: any) {
    response = error;
  }

  return response;
};

interface CreatePayoutIntentProps {
  bodyParams: {
    amount: number;
    currency: string;
    'automatic_payment_methods[enabled]': boolean;
    customer: string;
    description: string;
  };
}

export const onCreatePayoutIntent = async (props: CreatePayoutIntentProps) => {
  const {bodyParams} = props || {};

  let response;
  try {
    const endPoint = apiConstants.createPayoutIntent;
    console.log(endPoint,'---------------------Stripe Payment--------------------')
    console.log(bodyParams,'---------------------Stripe Payment Request--------------------')
    const data = await API.paymentService.post(endPoint, bodyParams, {
      headers: {
        Authorization: `Bearer ${ActiveEnv.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    response = {data: data?.data, statusCode: data?.status};
    console.log(response,'---------------------Stripe Payment Response--------------------')
  } catch (error: any) {
    response = error;
  }

  return response;
};

interface CreateSubscriptionProps {
  bodyParams: {
    mode: string;
    success_url: string;
    customer: string;
    'line_items[0][price]': string;
    'line_items[0][quantity]': number;
  };
}

export const onCreateSubscription = async (props: CreateSubscriptionProps) => {
  const {bodyParams} = props || {};

  let response;
  try {
    const endPoint = apiConstants.createSubscription;
    const data = await API.paymentService.post(endPoint, bodyParams, {
      headers: {
        Authorization: `Bearer ${ActiveEnv.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    response = {data: data?.data, statusCode: data?.status};
  } catch (error: any) {
    response = error;
  }

  return response;
};
