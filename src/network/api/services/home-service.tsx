import { apiConstants } from '@network/constant';
import { API } from '..';
import { getApiResponse } from '@network/utils/get-api-response';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface EventProps {
  queryParams: {
    limit: number;
    page: number;
  };
  bodyParams?: {
    start_date: string;
    end_date: string;
    event_type:string;
    only_upcoming:number;
    searchtext:string
  };
  userId?: string;
}

export const getData = async () => {
  try {
    const reso = await AsyncStorage.getItem('item')
    console.log(reso)

  } catch (error) {

  }
}

export const onFetchEvents = async (props: EventProps) => {
  let response;
  try {
    const { bodyParams, queryParams } = props || {};
    console.log(bodyParams,'bodyParams bodyParams')
    const endPoint = `${apiConstants.eventLists}${props?.userId ? `/${props?.userId}` : ''
      }`;
      console.log(endPoint,'----------------------------Event list endPoint-----------------------');
    const data = await API.homeService.post(endPoint, bodyParams, {
      params: queryParams,
    });
    response = getApiResponse(data);
    console.log(response,'----------------------------Event list-----------------------');
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
  quantity:string;
  max_quantity_to_show: string,
  available_quantity: string
}

export interface TicketBodyParamPropsData {
  name: string;
  start_date: string;
  end_date: string;
  price: string;
  // event: string;
  id?: string;
  quantity:string;
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
    console.log('----------------onCreateTicket---------------------------',endPoint)
    const data = await API.homeService.post(endPoint, {
      ...remainingProps,
      start_date: new Date(start_date),
      end_date: new Date(end_date),
    });
    response = getApiResponse(data);
    console.log('----------------onCreateTicket Response---------------------------',response)
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
    console.log('-----------------------ticketHolderCheckins------------------------',endPoint)
    const data = await API.homeService.get(endPoint, { params: queryParams });
    console.log(data)
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
    about?:string
    latitude?:string,
    longitude?:string,
    type?:string
  };
  eventId?: string;
}

export const onUpdateEvent = async (props: UpdateEventProps) => {
  console.log('111112222')
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
    type
     
  } = bodyParams || {};
  let response;

  const attachment = new FormData();
  if (eventImage) {
    attachment.append('event_image', {
      uri: eventImage,
      type: 'jpg',
      name: 'eventImage.jpg',
    });
  }
  if (address) {
    attachment.append('address', address);
  }
  if (about) {
    attachment.append('about', about);
  }
  if (full_address) {
    attachment.append('full_address', full_address);
  }
  if (emailConfirmationBody) {
    attachment.append('email_confirmation_body', emailConfirmationBody);
  }
  if (tickets?.length) {
    attachment.append('tickets', tickets);
  }
  if (name) {
    attachment.append('name', name);
  }
  if (endDate) {
    attachment.append('end_date', new Date(endDate).toISOString());
  }
  if (startDate) {
    attachment.append('start_date', new Date(startDate).toISOString());
  }
  // if (latitude) {
    attachment.append('event_lat', latitude);
  // }
  // if (longitude) {
    attachment.append('event_lng', longitude);

    attachment.append('event_type', type);
  // }

  console.log(attachment,'-----------------update event request-------------')

  try {
    const endPoint = `${apiConstants.createEvent}/${eventId}`;
    console.log(endPoint,'------------------endPoint Save event detail---------------------')
    const data = await API.homeService.patch(endPoint, attachment);
    response = getApiResponse(data);
    console.log(response,'------------------endPoint Save event detail---------------------')
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
    about?:string;
    latitude?:string,
    longitude?:string
    type:string
  };
}

export const onCreateEvent = async (props: CreateEventProps) => {
  console.log('333333')
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
    type

  } = bodyParams || {};
  let response;
console.log(bodyParams)
  const attachment = new FormData();
  attachment.append('event_image', {
    uri: eventImage,
    type: 'jpg',
    name: 'eventImage.jpg',
  });
  attachment.append('address', address);
  attachment.append('about', about);
  attachment.append('full_address', full_address);
  attachment.append('email_confirmation_body', email_confirmation_body);
  attachment.append('tickets', tickets);
  attachment.append('name', name);
  attachment.append('end_date', new Date(end_date).toISOString());
  attachment.append('start_date', new Date(start_date).toISOString());
  attachment.append('event_lat', latitude);
  attachment.append('event_lng', longitude);
  attachment.append('event_type', type);
  console.log(attachment,'--------------------------create event request-------------------------')
  try {
    const endPoint = `${apiConstants.createEvent}`;
    const data = await API.homeService.post(endPoint, attachment);
    console.log(endPoint,'--------------------------create event url-------------------------')
    console.log(attachment,'--------------------------create event request-------------------------')
    response = getApiResponse(data);
  } catch (error: any) {
    response = getApiResponse(error);
  }
  console.log('res===', response);

  return response;
};

export interface EventDetailsProps {
  eventId: string;
}

export const onFetchEventDetails = async (props: EventDetailsProps) => {
  let response;

  try {
    const endPoint = `${apiConstants.createEvent}/${props?.eventId}`;
    console.log(endPoint,'---------------------------event detail url-----------------------------')
    const data = await API.homeService.get(endPoint);
    response = getApiResponse(data);
    console.log(response,'---------------------------event detail-----------------------------')
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
    console.log('----------------onEditTicket---------------------------',endPoint)
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

interface Tip { }

interface AutomaticPaymentMethods {
  allow_redirects: string;
  enabled: boolean;
}

interface Metadata { }

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

  try {
    const endPoint = apiConstants.purchaseTicket;
    const data = await API.homeService.post(endPoint, bodyParams);
    console.log('Purchase Ticket data',bodyParams)
    response = getApiResponse(data);
    console.log('Purchase Ticket Response',response)
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
  color:string;
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
  const {packageId} = props || {};

  let response;
  try {
    const endPoint = `${apiConstants.packageDetails}/${props?.packageId}`;
    const data = await API.paymentService.get(endPoint);
    response = {data: data?.data, statusCode: data?.status};
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

