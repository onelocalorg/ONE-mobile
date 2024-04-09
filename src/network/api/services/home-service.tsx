import { apiConstants } from "@network/constant";
import { API } from "..";
import { getApiResponse } from "@network/utils/get-api-response";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface EventProps {
  queryParams: {
    limit: number;
    page: number;
  };
  bodyParams?: {
    start_date: string;
    end_date: string;
    event_type: string;
    only_upcoming: number;
    searchtext: string;
  };
  userId?: string;
}

export const getData = async () => {
  try {
    const reso = await AsyncStorage.getItem("item");
  } catch (error) {}
};

export const onFetchEvents = async (props: EventProps) => {
  let response;
  try {
    const { bodyParams, queryParams } = props || {};
    const endPoint = `${apiConstants.eventLists}${
      props?.userId ? `/${props?.userId}` : ""
    }`;
    const data = await API.homeService.post(endPoint, bodyParams, {
      params: queryParams,
    });
    response = getApiResponse(data);
  } catch (error: any) {
    response = getApiResponse(error);
  }

  return response;
};

export interface TicketBodyParamProps {
  name: string;
  start_date: string;
  end_date: string;
  price: string;
  event: string;
  id?: string;
  quantity: string;
  max_quantity_to_show: string;
  available_quantity: string;
}

export interface TicketBodyParamPropsData {
  name: string;
  start_date: string;
  end_date: string;
  price: string;
  // event: string;
  id?: string;
  quantity: string;
}

export interface TicketProps {
  bodyParams: TicketBodyParamPropsData;
  ticketId?: string;
}

export const onCreateTicket = async (props: TicketProps) => {
  let response;
  const { start_date, end_date, ...remainingProps } = props?.bodyParams || {};
  try {
    const endPoint = apiConstants.createTicket;
    const data = await API.homeService.post(endPoint, {
      ...remainingProps,
      start_date: new Date(start_date),
      end_date: new Date(end_date),
    });
    response = getApiResponse(data);
  } catch (error: any) {
    response = getApiResponse(error);
  }

  return response;
};

export interface TickeHolderProps {
  queryParams?: {
    limit?: number;
    page?: number;
    pagination?: boolean;
  };
  eventId?: string;
}

export const onFetchTicketHolderList = async (props: TickeHolderProps) => {
  const { queryParams, eventId } = props || {};
  let response;
  try {
    const endPoint = `${apiConstants.ticketHolderCheckins}/${eventId}`;
    const data = await API.homeService.get(endPoint, { params: queryParams });
    response = getApiResponse(data);
  } catch (error: any) {
    response = getApiResponse(error);
  }

  return response;
};

export interface CheckedInUserProps {
  bodyParams: {
    isCheckedIn: boolean;
  };
  checkInUserId?: string;
}

export const onCheckedInUser = async (props: CheckedInUserProps) => {
  const { bodyParams, checkInUserId } = props || {};
  let response;
  try {
    const endPoint = `${apiConstants.checkedInUser}/${checkInUserId}`;
    const data = await API.homeService.patch(endPoint, bodyParams);
    response = getApiResponse(data);
  } catch (error: any) {
    response = getApiResponse(error);
  }

  return response;
};

interface UpdateEventProps {
  bodyParams: {
    name?: string;
    startDate?: string;
    endDate?: string;
    address?: string;
    full_address?: string;
    emailConfirmationBody?: string;
    tickets?: string[];
    eventImage?: string;
    about?: string;
    latitude?: string;
    longitude?: string;
    type?: string;
  };
  eventId?: string;
}

export const onUpdateEvent = async (props: UpdateEventProps) => {
  const { bodyParams, eventId } = props || {};
  const {
    address,
    emailConfirmationBody,
    endDate,
    name,
    startDate,
    tickets,
    full_address,
    eventImage,
    about,
    latitude,
    longitude,
    type,
  } = bodyParams || {};
  let response;

  const attachments = {
    name: name,
    start_date: startDate,
    end_date: endDate,
    about: about,
    address: address,
    full_address: full_address,
    email_confirmation_body: emailConfirmationBody,
    tickets: tickets,
    event_lat: latitude,
    event_lng: longitude,
    event_type: type,
    event_image: eventImage,
  };

  console.log(attachments,'-------------------update event request--------------------');
  try {
    const endPoint = `${apiConstants.createEvent}/${eventId}`;
    const data = await API.homeService.patch(endPoint, attachments);
    response = getApiResponse(data);
  } catch (error: any) {
    response = getApiResponse(error);
  }

  return response;
};

interface CreateEventProps {
  bodyParams: {
    name: string;
    start_date: string;
    end_date: string;
    address: string;
    email_confirmation_body: string;
    tickets: string[];
    full_address: string;
    eventImage: string;
    about?: string;
    latitude?: string;
    longitude?: string;
    type: string;
  };
}

export const onCreateEvent = async (props: CreateEventProps) => {
  console.log("2");
  const { bodyParams } = props || {};
  const {
    address,
    email_confirmation_body,
    start_date,
    name,
    end_date,
    tickets,
    full_address,
    eventImage,
    about,
    latitude,
    longitude,
    type,
  } = bodyParams || {};
  let response;

  var attachments = {}
  if(tickets?.length){
     attachments = {
      name: name,
      start_date: new Date(start_date).toISOString(),
      end_date: new Date(end_date).toISOString(),
      about: about,
      address: address,
      full_address: full_address,
      email_confirmation_body: email_confirmation_body,
      tickets: tickets,
      event_lat: latitude,
      event_lng: longitude,
      event_type: type,
      event_image: eventImage,
    };
  }else{
     attachments = {
      name: name,
      start_date: new Date(start_date).toISOString(),
      end_date: new Date(end_date).toISOString(),
      about: about,
      address: address,
      full_address: full_address,
      email_confirmation_body: email_confirmation_body,
      event_lat: latitude,
      event_lng: longitude,
      event_type: type,
      event_image: eventImage,
    };
  }
  console.log(attachments,'-------------------create event request start date--------------------');
  try {
    console.log(attachments);
    const endPoint = `${apiConstants.createEvent}`;
    const data = await API.homeService.post(endPoint, attachments);
    response = getApiResponse(data);
    console.log(response, "response response");
  } catch (error: any) {
    response = getApiResponse(error);
  }
  return response;
};

export interface EventDetailsProps {
  eventId: string;
}

export const onFetchEventDetails = async (props: EventDetailsProps) => {
  let response;

  try {
    const endPoint = `${apiConstants.createEventDetail}/${props?.eventId}`;
    const data = await API.homeService.get(endPoint);
    response = getApiResponse(data);
  } catch (error: any) {
    response = getApiResponse(error);
  }

  return response;
};

export const onEditTicket = async (props: TicketProps) => {
  let response;
  const { start_date, end_date, ...remainingProps } = props?.bodyParams || {};
  try {
    const endPoint = `${apiConstants.createTicket}/${props?.ticketId}`;
    const data = await API.homeService.patch(endPoint, {
      ...remainingProps,
      start_date: new Date(start_date),
      end_date: new Date(end_date),
    });
    response = getApiResponse(data);
  } catch (error: any) {
    response = getApiResponse(error);
  }

  return response;
};

interface PurchaseTicketProps {
  bodyParams: {
    eventId: string;
    ticketId: string;
    ticketName: string;
    ticketPrice: string;
    stripeResponse: PurchaseProps;
  };
}

export interface PurchaseProps {
  id: string;
  object: string;
  amount: number;
  amount_capturable: number;
  amount_details: AmountDetails;
  amount_received: number;
  application: any;
  application_fee_amount: any;
  automatic_payment_methods: AutomaticPaymentMethods;
  canceled_at: any;
  cancellation_reason: any;
  capture_method: string;
  client_secret: string;
  confirmation_method: string;
  created: number;
  currency: string;
  customer: string;
  description: string;
  invoice: any;
  last_payment_error: any;
  latest_charge: any;
  livemode: boolean;
  metadata: Metadata;
  next_action: any;
  on_behalf_of: any;
  payment_method: any;
  payment_method_options: PaymentMethodOptions;
  payment_method_types: string[];
  processing: any;
  receipt_email: any;
  review: any;
  setup_future_usage: any;
  shipping: any;
  source: any;
  statement_descriptor: any;
  statement_descriptor_suffix: any;
  status: string;
  transfer_data: any;
  transfer_group: any;
}

interface AmountDetails {
  tip: Tip;
}

interface Tip {}

interface AutomaticPaymentMethods {
  allow_redirects: string;
  enabled: boolean;
}

interface Metadata {}

interface PaymentMethodOptions {
  card: Card;
}

interface Card {
  installments: any;
  mandate_options: any;
  network: any;
  request_three_d_secure: string;
}

export const onPurchaseTicket = async (props: PurchaseTicketProps) => {
  const { bodyParams } = props ?? {};
  let response;
  console.log(bodyParams, "bodyParams");
  try {
    const endPoint = apiConstants.purchaseTicket;
    const data = await API.homeService.post(endPoint, bodyParams);
    response = getApiResponse(data);
    console.log(response);
  } catch (error: any) {
    response = getApiResponse(error);
  }

  return response;
};

export const onGetSubscriptionPlans = async () => {
  let response;

  try {
    const endPoint = apiConstants.subscriptionPlans;
    const data = await API.homeService.get(endPoint);
    response = getApiResponse(data);
  } catch (error: any) {
    response = getApiResponse(error);
  }

  return response;
};

export interface AboutBodyProps {
  title: string;
  image: string;
  price: string;
  description: Price;
  id: string;
  status: string;
  key: string;
  color: string;
}

export interface Price {
  $numberDecimal: string;
}

export const onGetPackage = async () => {
  let response;

  try {
    const endPoint = apiConstants.package;
    const data = await API.homeService.get(endPoint);
    response = getApiResponse(data);
  } catch (error: any) {
    response = getApiResponse(error);
  }

  return response;
};

interface AboutProps {
  packageId?: string;
}

export const onGetPackageDetail = async (props: AboutProps) => {
  const { packageId } = props || {};

  let response;
  try {
    const endPoint = `${apiConstants.packageDetails}/${props?.packageId}`;
    const data = await API.paymentService.get(endPoint);
    response = { data: data?.data, statusCode: data?.status };
  } catch (error: any) {
    response = error;
  }

  return response;
};

// export const onGetPackageDetail = async () => {
//   let response;

//   try {
//     const endPoint =  apiConstants.packageDetails;
//     console.log('endPoint==========',endPoint)
//     const data = await API.homeService.get(endPoint);
//     response = getApiResponse(data);
//   } catch (error: any) {
//     response = getApiResponse(error);
//   }
//   return response;
// };
