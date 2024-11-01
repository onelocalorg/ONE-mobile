export const dataObject: any = [];

export const getData = (key: any) => {
  if (key == undefined) {
    return 1;
  } else {
    return dataObject[key];
  }
};

export const setData = (key: any, value: any) => {
  dataObject[key] = value;
};

export const apiConstants = {
  login: "/v3/auth/login",
  userProfile: "/v3/users",
  eventLists: "/v3/events/list",
  createTicket: "/v3/tickets",
  editProfile: "/v3/users/",
  refreshTokens: "/v3/auth/refresh-tokens",
  ticketHolderCheckins: "/v3/events/getTicketHolders",
  checkedInUser: "/v3/tickets/checkedInEvent",
  createEvent: "/v3/events",
  createEventDetail: "/v3/events",
  appConfig: "/v3/auth/appConfig",
  purchaseTicket: "/v3/tickets/store-purchase-response",
  createSubscription: "/v3/checkout/sessions",
  subscriptionPlans: "/v3/subscriptions/plans",
  package: "v1/subscriptions/packages",
  packageDetails: "v1/subscriptions/packages/",
};

export const methods = {
  post: "POST",
  get: "GET",
};

export const persistKeys = {
  token: "token",
  refreshToken: "refreshToken",
  myId: "myId",
  myEmail: "myEmail",
  fcmToken: "@fcmToken",
};

export const apiKeys = {
  userProfile: "userProfile",
  ticketHolderCheckins: "ticketHolderCheckins",
  fetchEventDetails: "fetchEventDetails",
  appConfig: "appConfig",
  subscriptionPlans: "subscriptionPlans",
  packageDetail: "packageDetails",
};

export const IOS_VERSION = "8.0.1";
export const ANDROID_VERSION = "2.0.1";
