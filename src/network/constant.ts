

import ActiveEnv from '@config/env/env.dev.json';
export const dataObject:any = [];

export const getData = (key:any) => { 
  if (key == undefined) {
    return 1;
  }else{
    return dataObject[key];
  }
};

export const setData = (key:any, value:any) => {
  dataObject[key] = value;
}; 
 
export const apiConstants = {
  login: '/v1/auth/login',
  userProfile: '/v1/users',
  eventLists: '/v1/events/list',
  createTicket: '/v1/tickets',
  editProfile: '/v1/users/',
  refereshToken: '/v1/auth/refresh-tokens',
  ticketHolderCheckins: '/v1/events/getTicketHolders',
  checkedInUser: '/v1/tickets/checkedInEvent',
  createEvent: '/v1/events',
  createStripeCustomer: '/v1/customers',
  createPayoutIntent: '/v1/payment_intents',
  saveCustomerId: '/v1/users/save-customer-id',
  appConfig: '/v1/auth/appConfig',
  purchaseTicket: '/v1/tickets/store-purchase-response',
  createSubscription: '/v1/checkout/sessions',
  subscriptionPlans: '/v1/subscriptions/plans',
  package:'v1/subscriptions/packages',
  packageDetails:'v1/subscriptions/packages/'
};

export const methods = {
  post: 'POST',
  get: 'GET',
};

export const persistKeys = {
  token: 'token',
  fcmToken: '@fcmToken',
};

export const apiKeys = {
  userProfile: 'userProfile',
  ticketHolderCheckins: 'ticketHolderCheckins',
  fetchEventDetails: 'fetchEventDetails',
  appConfig: 'appConfig',
  subscriptionPlans: 'subscriptionPlans',
  packageDetail:'packageDetails'
};

export const API_URL = ActiveEnv.BASE_URL
export const IOS_VERSION = '7.8.5'
export const ANDROID_VERSION = '7.8.5'
export const STIPE_BASE_URL = ActiveEnv.STIPE_BASE_URL
export const STRIPE_PUBLIC_KEY = ActiveEnv.STRIPE_PUBLISHABLE_KEY
export const STRIPE_SECRET_KEY = ActiveEnv.STRIPE_SECRET_KEY



 

