import { queryOptions, useQueryClient } from "@tanstack/react-query";
import _ from "lodash/fp";
import { EventFinancials } from "~/types/event-financials";
import {
  LocalEvent,
  LocalEventData,
  LocalEventUpdateData,
} from "~/types/local-event";
import { Payment, PaymentData } from "~/types/payment";
import { PriceBreakdown } from "~/types/price-breakdown";
import { Rsvp, RsvpData, RsvpList } from "~/types/rsvp";
import { TicketSelection } from "~/types/ticket-selection";
import { useApiService } from "./ApiService";

export enum EventMutations {
  createEvent = "createEvent",
  editEvent = "editEvent",
  cancelEvent = "cancelEvent",
  createRsvp = "createRsvp",
  deleteRsvp = "deleteRsvp",
  createPayment = "createPayment",
  editPayment = "editPayment",
  deletePayment = "deletePayment",
}

export function useEventService() {
  const queryClient = useQueryClient();

  const queries = {
    all: () => ["events"],
    lists: () => [...queries.all(), "list"],
    list: (filters?: GetEventsParams) =>
      queryOptions({
        queryKey: [...queries.lists(), filters],
        queryFn: () => getEvents(filters),
      }),
    details: () => [...queries.all(), "detail"],
    detail: (id?: string) =>
      queryOptions({
        queryKey: [...queries.details(), id],
        queryFn: () => getEvent(id!),
        enabled: !!id,
        staleTime: 5000,
      }),
    rsvps: () => [...queries.details(), "rsvps"],
    rsvpsForEvent: (eventId: string) =>
      queryOptions({
        queryKey: [...queries.rsvps(), eventId],
        queryFn: () => getRsvps(eventId),
        staleTime: 5000,
      }),
    financialsForEvent: (eventId: string) =>
      queryOptions({
        queryKey: [...queries.detail(eventId).queryKey, "financials"],
        queryFn: () => getFinancials(eventId),
        staleTime: 5000,
      }),
    payments: () => ["payments"],
    paymentsForEvent: (eventId: string) =>
      queryOptions({
        queryKey: [...queries.financialsForEvent(eventId).queryKey, "payments"],
        queryFn: () => getPayments(eventId),
        staleTime: 5000,
      }),
    paymentDetail: (paymentId: PaymentId) =>
      queryOptions({
        queryKey: [
          ...queries.paymentsForEvent(paymentId.eventId).queryKey,
          paymentId.id,
        ],
        queryFn: () => getPayment(paymentId),
        staleTime: 5000,
      }),
  };

  queryClient.setMutationDefaults([EventMutations.createEvent], {
    mutationFn: (eventData: LocalEventData) => {
      return createEvent(eventData);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queries.all() });
    },
  });

  queryClient.setMutationDefaults([EventMutations.editEvent], {
    mutationFn: (params: LocalEventUpdateData) => {
      return updateEvent(params);
    },
    onSuccess: (resp: LocalEvent) => {
      void queryClient.invalidateQueries({
        queryKey: queries.detail(resp.id).queryKey,
      });

      // TODO Change cache to invalidate less
      void queryClient.invalidateQueries({ queryKey: queries.lists() });
    },
  });

  queryClient.setMutationDefaults([EventMutations.cancelEvent], {
    mutationFn: (postId: string) => {
      return cancelEvent(postId);
    },
    onSuccess: (resp: LocalEvent) => {
      void queryClient.invalidateQueries({
        queryKey: queries.lists(),
      });
    },
  });
  queryClient.setMutationDefaults([EventMutations.createRsvp], {
    mutationFn: (data: RsvpData) => {
      return createRsvp(data);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queries.rsvps(),
      });
    },
  });
  queryClient.setMutationDefaults([EventMutations.deleteRsvp], {
    mutationFn: (data: DeleteRsvpProps) => {
      return deleteRsvp(data);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queries.rsvps(),
      });
    },
  });
  queryClient.setMutationDefaults([EventMutations.createPayment], {
    mutationFn: (data: PaymentData) => {
      return createPayment(data);
    },
    onSuccess: (result: Payment) => {
      console.log(
        "invalidating query",
        queries.financialsForEvent(result.eventId).queryKey
      );
      void queryClient.invalidateQueries({
        queryKey: queries.financialsForEvent(result.eventId).queryKey,
      });
    },
  });
  queryClient.setMutationDefaults([EventMutations.editPayment], {
    mutationFn: (data: PaymentData) => {
      return updatePayment(data);
    },
    onSuccess: (result: Payment) => {
      void queryClient.invalidateQueries({
        queryKey: queries.financialsForEvent(result.eventId).queryKey,
      });
    },
  });
  queryClient.setMutationDefaults([EventMutations.deletePayment], {
    mutationFn: (data: PaymentId) => {
      return deletePayment(data);
    },
    onSuccess: (result: PaymentId) => {
      void queryClient.invalidateQueries({
        queryKey: queries.financialsForEvent(result.eventId).queryKey,
      });
    },
  });

  const { doGet, doPatch, doPost, doDelete } = useApiService();

  const getEvent = (id: string) => doGet<LocalEvent>(`/v3/events/${id}`);

  const createEvent = (eventData: LocalEventData) =>
    doPost(`/v3/events`, eventData);

  const updateEvent = (data: LocalEventUpdateData) =>
    doPatch<LocalEvent>(`/v3/events/${data.id}`, _.omit(["id"], data));

  const cancelEvent = (id: string) =>
    doPost<LocalEvent>(`/v3/events/${id}/cancel`);

  type GetEventsParams = {
    isPast?: boolean;
    isCanceled?: boolean;
    host?: string;
  };
  const getEvents = ({
    isPast,
    isCanceled,
    host,
  }: GetEventsParams | undefined = {}) => {
    const urlParams: string[] = [];
    if (!_.isNil(isPast)) urlParams.push(`past=${isPast.toString()}`);
    if (!_.isNil(isCanceled))
      urlParams.push(`canceled=${isCanceled.toString()}`);
    if (!_.isNil(host)) urlParams.push(`host=${host}`);

    const urlSearchParams = urlParams.join("&");

    return doGet<LocalEvent[]>(`/v3/events?${urlSearchParams}`);
  };

  const getRsvps = (eventId: string) => {
    return doGet<RsvpList>(`/v3/events/${eventId}/rsvps/`);
  };

  const createRsvp = (data: RsvpData) => {
    return doPost<Rsvp>(
      `/v3/events/${data.eventId}/rsvps`,
      _.omit("eventId", data)
    );
  };

  interface DeleteRsvpProps {
    id: string;
    eventId: string;
  }
  const deleteRsvp = ({ id, eventId }: DeleteRsvpProps) => {
    return doDelete<Rsvp>(`/v3/events/${eventId}/rsvps/${id}`);
  };

  const getFinancials = (eventId: string) => {
    return doGet<EventFinancials>(`/v3/events/${eventId}/financials`);
  };

  const getPayments = async (eventId: string) => {
    return doGet<Payment[]>(`/v3/events/${eventId}/payments`);
  };

  const getPayment = async ({
    id,
    eventId,
  }: {
    id: string;
    eventId: string;
  }) => {
    return doGet<Payment>(`/v3/events/${eventId}/payments/${id}`);
  };

  const createPayment = (data: PaymentData) => {
    return doPost<Payment>(
      `/v3/events/${data.eventId}/payments`,
      _.omit(["eventId", "user"], {
        ...data,
        userId: data.user.id,
      })
    );
  };

  const updatePayment = (data: PaymentData) => {
    return doPatch<Payment>(
      `/v3/events/${data.eventId}/payments/${data.id}`,
      _.omit(["id", "eventId", "user"], {
        ...data,
        userId: data.user.id,
      })
    );
  };

  const deletePayment = ({ id, eventId }: PaymentId) => {
    return doDelete<Payment>(`/v3/events/${eventId}/payments/${id}`);
  };

  async function getTicketPriceBreakdown(
    eventId: string,
    tickets: TicketSelection[]
  ) {
    const qs = tickets
      .map((ts) => `tid=${ts.type.id}&q=${ts.quantity}`)
      .join("&");

    const resp = await doGet<PriceBreakdown>(
      `/v3/events/${eventId}/prices?${qs}`
    );
    return resp;
  }

  // interface TickeHolderProps {
  //   queryParams?: {
  //     limit?: number;
  //     page?: number;
  //     pagination?: boolean;
  //   };
  //   eventId?: string;
  // }

  // const onFetchTicketHolderList = async (props: TickeHolderProps) => {
  //   const { queryParams, eventId } = props || {};
  //   let response;
  //   try {
  //     const endPoint = `${apiConstants.ticketHolderCheckins}/${eventId}`;
  //     const data = await API.homeService.get(endPoint, { params: queryParams });
  //     response = getApiResponse(data);
  //   } catch (error: any) {
  //     response = getApiResponse(error);
  //   }

  //   return response;
  // };

  // interface CheckedInUserProps {
  //   bodyParams: {
  //     isCheckedIn: boolean;
  //   };
  //   checkInUserId?: string;
  // }

  // const onCheckedInUser = async (props: CheckedInUserProps) => {
  //   const { bodyParams, checkInUserId } = props || {};
  //   let response;
  //   try {
  //     const endPoint = `${apiConstants.checkedInUser}/${checkInUserId}`;
  //     const data = await API.homeService.patch(endPoint, bodyParams);
  //     response = getApiResponse(data);
  //   } catch (error: any) {
  //     response = getApiResponse(error);
  //   }

  //   return response;
  // };

  // const onEditTicket = async (props: TicketProps) => {
  //   let response;
  //   const { start_date, end_date, ...remainingProps } = props?.bodyParams || {};
  //   try {
  //     const endPoint = `${apiConstants.createTicket}/${props?.ticketId}`;
  //     const data = await API.homeService.patch(endPoint, {
  //       ...remainingProps,
  //       start_date: new Date(start_date),
  //       end_date: new Date(end_date),
  //     });
  //     response = getApiResponse(data);
  //   } catch (error: any) {
  //     response = getApiResponse(error);
  //   }

  //   return response;
  // };

  return {
    queries,
    getEvent,
    createEvent,
    updateEvent,
    cancelEvent,
    getEvents,
    getRsvps,
    deleteRsvp,
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

export interface PaymentId {
  id: string;
  eventId: string;
}
