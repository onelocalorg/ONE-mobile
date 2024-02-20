


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

export const API_URL = 'https://app.onelocal.one/api'

export const STIPE_BASE_URL = 'https://api.stripe.com'

export const STRIPE_PUBLIC_KEY = 'pk_live_51ILwo9GFoMwnONQ0OGHR45KsEagFfXy7COuo9Ner5SHrnRmTJIA7hjli2AyqRVb6uKkrZaiCdTvGsN0JKkEMYFjR00mNeywjyx'
export const STRIPE_SECRET_KEY = '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'

// export const API_URL = 'https://eventmvp.developmentlabs.co/api'
// export const STRIPE_PUBLIC_KEY = 'pk_test_51ILwo9GFoMwnONQ0gs60JkdjJlMCz6TU9iAB39fibm74Fv7pQ75nkawaVeEMcLXkHg80vN2c310kQ0izchqL6Rir00PU58FXrZ'
// export const STRIPE_SECRET_KEY = 'sk_test_51ILwo9GFoMwnONQ0qlaqHJOUpu3LcReBKZZcAPZ4h11EsHqEDB4NemkZ7ywHw3LX6iAmoCEbBjEth2mwZwKQJKqS00CDnJ2YyR'



export const SELECTED_EVENT_TAB = 1;


