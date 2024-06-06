import _ from "lodash/fp";
import { DateTime } from "luxon";
import { apiConstants } from "~/network/constant";
import { getApiResponse } from "~/network/utils/get-api-response";
import { EventProducer } from "~/types/event-producer";
import { LocalEvent } from "~/types/local-event";
import { LocalEventData } from "~/types/local-event-data";
import { LocalEventUpdateData } from "~/types/local-event-update-data";
import { OneUser } from "~/types/one-user";
import { PriceBreakdown } from "~/types/price-breakdown";
import { Rsvp, RsvpList, RsvpType } from "~/types/rsvp";
import { TicketSelection } from "~/types/ticket-selection";
import { TicketType } from "~/types/ticket-type";
import { API } from "..";
import { doGet, doPatch, doPost } from "./api-service";

export const createEvent = (eventData: LocalEventData) =>
  doPost(`/v2/events`, localEventToBody(eventData), resourceToLocalEvent);

export const updateEvent = (eventId: string, event: LocalEventUpdateData) =>
  doPatch(
    `/v2/events/${eventId}`,
    localEventToBody(event),
    resourceToLocalEvent
  );

type ListEventsParams = {
  startDate?: DateTime;
  isCanceled?: boolean;
};
export const listEventsForMap = (params: ListEventsParams) =>
  listEventsInternal({
    ...params,
    formatForMap: true,
  }) as Promise<GeoJSON.FeatureCollection>;

export const listEvents = (params: ListEventsParams) =>
  listEventsInternal({
    ...params,
    formatForMap: false,
  }) as Promise<LocalEvent[]>;

type ListEventsInternalParams = {
  startDate?: DateTime;
  isCanceled?: boolean;
  formatForMap?: boolean;
};
const listEventsInternal = async ({
  startDate,
  isCanceled,
  formatForMap = false,
}: ListEventsInternalParams) => {
  const urlParams: string[] = [];
  if (!_.isNil(startDate)) urlParams.push(`start_date=${startDate.toISO()}`);
  if (!_.isNil(isCanceled)) urlParams.push(`canceled=${isCanceled.toString()}`);

  const urlSearchParams = urlParams.join("&");

  const events = await doGet(
    `/v2/events?${urlSearchParams.toString()}`,
    formatForMap
      ? resourcesToFeatureCollection
      : (data) => data.map(resourceToLocalEvent)
  );
  console.log("events", events);
  return events;
};

export const getEvent = (id: string) =>
  doGet(`/v1/events/${id}`, resourceToLocalEvent);

interface CreateEventBody {
  name: string;
  start_date: string;
  timeOffset: string;
  lat: number;
  lng: number;
}

interface EventBody {
  name?: string;
  start_date?: string;
  end_date?: string;
  timeOffset?: string;
  about?: string;
  address?: string;
  full_address?: string;
  location?: GeoJSON.Point;
  lat?: number;
  long?: number;
  eventProducer?: EventProducer;
  email_confirmation_body?: string;
  event_image?: string;
  ticketTypes?: TicketType[];
  isCanceled?: boolean;
  event_type?: string;
}

interface EventResource extends EventBody {
  id: string;
  name: string;
  start_date: string;
  full_address: string;
  location: GeoJSON.Point;
  lat: number;
  long: number;
  eventProducer: EventProducer;
  email_confirmation_body: string;
  ticketTypes: TicketType[];
  isCanceled: boolean;
  viewCount: number;
  isPayout: boolean;
  payoutProcess: string;
  payout: any;
  event_type: string;
  is_event_owner: boolean;
  totalRevenue: number;
}

const resourcesToFeatureCollection = (events: EventResource[]) => ({
  type: "FeatureCollection",
  features: events.map((event) => ({
    type: "Feature",
    properties: { ..._.omit(["location", "_id"], event) },
    geometry: event.location,
  })),
});

const resourceToLocalEvent = (data: EventResource) =>
  ({
    ...data,
    startDate: DateTime.fromISO(data.start_date),
    endDate: data.end_date ? DateTime.fromISO(data.end_date) : undefined,
    latitude: data.lat,
    longitude: data.long,
    eventImage: data.event_image,
    fullAddress: data.full_address,
    ticketTypes:
      data.ticketTypes?.map((tt) => ({
        ...tt,
        price: tt.price,
      })) ?? [],
  } as LocalEvent);

const localEventToBody = (data: LocalEventUpdateData) =>
  ({
    name: data.name,
    start_date: data.startDate?.toISO(),
    end_date: data.endDate?.toISO(),
    about: data.about,
    address: data.address,
    full_address: data.fullAddress,
    email_confirmation_body: data.emailConfirmationBody,
    ticketTypes: data.ticketTypes,
    event_lat: data.latitude,
    event_lng: data.longitude,
    event_type: data.type,
    event_image: data.eventImage,
  } as EventBody);

export const featureToLocalEvent = (feature: GeoJSON.Feature) => {
  const properties = feature.properties as EventResource;
  console.log("featureToLocalEvent", properties);
  return {
    ..._.omit(
      ["location", "start_date", "end_date", "full_address"],
      resourceToLocalEvent(properties)
    ),

    startDate: DateTime.fromISO(properties.start_date),
    endDate: properties.end_date
      ? DateTime.fromISO(properties.end_date)
      : undefined,
    latitude: (feature.geometry as GeoJSON.Point).coordinates[1],
    longitude: (feature.geometry as GeoJSON.Point).coordinates[0],
    fullAddress: properties.full_address,
  } as LocalEvent;
};

export interface TicketBodyParamProps {
  id?: string;
  name: string;
  start_date: string;
  end_date: string;
  price: string;
  event: string;
  quantity: string;
  max_quantity_to_show: string;
  available_quantity: string;
}

export const listRsvps = (eventId: string) => {
  return doGet<RsvpList>(`/v1/events/rsvp/${eventId}`, apiToRsvps);
};

export const updateRsvp = (eventId: string, rsvp: RsvpType) => {
  return doPost<Rsvp>(`/v1/events/rsvp/${eventId}`, {
    type: rsvp,
  });
};

interface RsvpListResource {
  rsvps: RsvpResource[];
  going: number;
  interested: number;
  cantgo: number;
}

interface RsvpResource {
  _id: string;
  rsvp: string;
  user_id: OneUser;
}

const apiToRsvps = (data: RsvpListResource) =>
  ({
    ...data,
    rsvps: data.rsvps.map(apiToRsvp),
  } as RsvpList);

const apiToRsvp = (data: RsvpResource) =>
  ({
    id: data._id,
    rsvp: data.rsvp,
    guest: data.user_id,
  } as Rsvp);

export async function getTicketPriceBreakdown(
  eventId: string,
  tickets: TicketSelection[]
) {
  let qs = tickets.map((ts) => `tid=${ts.type.id}&q=${ts.quantity}`).join("&");

  const resp = await doGet<PriceBreakdown>(
    `/v1/events/${eventId}/prices?${qs}`
  );
  return resp;
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

// export const onGetSubscriptionPlans = async () => {
//   let response;

//   try {
//     const endPoint = apiConstants.subscriptionPlans;
//     const data = await API.homeService.get(endPoint);
//     response = getApiResponse(data);
//   } catch (error: any) {
//     response = getApiResponse(error);
//   }

//   return response;
// };

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
