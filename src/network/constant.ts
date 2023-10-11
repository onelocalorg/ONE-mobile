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
};
