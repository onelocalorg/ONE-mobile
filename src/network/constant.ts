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
  login: "/v1/auth/login",
  userProfile: "/v1/users",
  eventLists: "/v1/events/list",
  createTicket: "/v1/tickets",
  editProfile: "/v1/users/",
  refreshTokens: "/v1/auth/refresh-tokens",
  ticketHolderCheckins: "/v1/events/getTicketHolders",
  checkedInUser: "/v1/tickets/checkedInEvent",
  createEvent: "/v2/events",
  createEventDetail: "/v1/events",
  appConfig: "/v1/auth/appConfig",
  purchaseTicket: "/v1/tickets/store-purchase-response",
  createSubscription: "/v1/checkout/sessions",
  subscriptionPlans: "/v1/subscriptions/plans",
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

export const IOS_VERSION = "7.10.0";
export const ANDROID_VERSION = "1.0.3";
