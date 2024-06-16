import _ from "lodash/fp";
import { DateTime } from "luxon";
import { LOG } from "~/config";
import { apiConstants } from "~/network/constant";
import { getApiResponse } from "~/network/utils/get-api-response";
import { LocalEvent } from "~/types/local-event";
import { LocalEventData } from "~/types/local-event-data";
import { LocalEventUpdateData } from "~/types/local-event-update-data";
import { OneUser } from "~/types/one-user";
import { PriceBreakdown } from "~/types/price-breakdown";
import { Rsvp, RsvpList, RsvpType } from "~/types/rsvp";
import { TicketSelection } from "~/types/ticket-selection";
import { API } from "..";
import { localEventToBody, resourceToLocalEvent } from "../types/LocalEvent";
import { useApiService } from "./api-service";

export function useEventService() {
  const { doGet, doPatch, doPost } = useApiService();

  const createEvent = (eventData: LocalEventData) =>
    doPost(`/v3/events`, localEventToBody(eventData), resourceToLocalEvent);

  const updateEvent = (eventId: string, event: LocalEventUpdateData) =>
    doPatch(
      `/v3/events/${eventId}`,
      localEventToBody(event),
      resourceToLocalEvent
    );

  type ListEventsParams = {
    startDate?: DateTime;
    isCanceled?: boolean;
    host?: string;
  };
  const listEvents = ({ startDate, isCanceled, host }: ListEventsParams) => {
    const urlParams: string[] = [];
    if (!_.isNil(startDate)) urlParams.push(`start_date=${startDate.toISO()}`);
    if (!_.isNil(isCanceled))
      urlParams.push(`canceled=${isCanceled.toString()}`);
    if (!_.isNil(host)) urlParams.push(`host=${host}`);

    const urlSearchParams = urlParams.join("&");
    LOG.debug("search", urlSearchParams);

    return doGet<LocalEvent[]>(`/v3/events?${urlSearchParams.toString()}`);
  };

  const getEvent = (id: string) =>
    doGet(`/v1/events/${id}`, resourceToLocalEvent);

  interface TicketBodyParamProps {
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

  const listRsvps = (eventId: string) => {
    return doGet<RsvpList>(`/v1/events/rsvp/${eventId}`, apiToRsvps);
  };

  const updateRsvp = (eventId: string, rsvp: RsvpType) => {
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

  async function getTicketPriceBreakdown(
    eventId: string,
    tickets: TicketSelection[]
  ) {
    const qs = tickets
      .map((ts) => `tid=${ts.type.id}&q=${ts.quantity}`)
      .join("&");

    const resp = await doGet<PriceBreakdown>(
      `/v1/events/${eventId}/prices?${qs}`
    );
    return resp;
  }

  interface TicketBodyParamPropsData {
    name: string;
    start_date: string;
    end_date: string;
    price: string;
    // event: string;
    id?: string;
    quantity: string;
  }

  interface TicketProps {
    bodyParams: TicketBodyParamPropsData;
    ticketId?: string;
  }

  const onCreateTicket = async (props: TicketProps) => {
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

  interface TickeHolderProps {
    queryParams?: {
      limit?: number;
      page?: number;
      pagination?: boolean;
    };
    eventId?: string;
  }

  const onFetchTicketHolderList = async (props: TickeHolderProps) => {
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

  interface CheckedInUserProps {
    bodyParams: {
      isCheckedIn: boolean;
    };
    checkInUserId?: string;
  }

  const onCheckedInUser = async (props: CheckedInUserProps) => {
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

  const onEditTicket = async (props: TicketProps) => {
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

  interface PurchaseProps {
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

  const onPurchaseTicket = async (props: PurchaseTicketProps) => {
    const { bodyParams } = props ?? {};
    let response;
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

  //  const onGetSubscriptionPlans = async () => {
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

  interface AboutBodyProps {
    title: string;
    image: string;
    price: string;
    description: Price;
    id: string;
    status: string;
    key: string;
    color: string;
  }

  interface Price {
    $numberDecimal: string;
  }

  const onGetPackage = async () => {
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

  const onGetPackageDetail = async (props: AboutProps) => {
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

  return {
    getEvent,
    createEvent,
    updateEvent,
    listEvents,
    listRsvps,
    updateRsvp,
    getTicketPriceBreakdown,
  };

  //  const onGetPackageDetail = async () => {
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
}
