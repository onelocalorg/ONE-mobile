import { queryOptions, useQueryClient } from "@tanstack/react-query";
import _ from "lodash/fp";
import { LOG } from "~/config";
import { LocalEvent } from "~/types/local-event";
import { LocalEventData } from "~/types/local-event-data";
import { LocalEventUpdateData } from "~/types/local-event-update-data";
import { PriceBreakdown } from "~/types/price-breakdown";
import { Rsvp, RsvpData, RsvpList } from "~/types/rsvp";
import { TicketSelection } from "~/types/ticket-selection";
import { useApiService } from "./ApiService";

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
    detail: (id: string) =>
      queryOptions({
        queryKey: [...queries.details(), id],
        queryFn: () => getEvent(id),
        enabled: !!id,
        staleTime: 5000,
      }),
    rsvps: () => ["rsvps"],
    rsvpsForEvent: (eventId: string) =>
      queryOptions({
        queryKey: [...queries.rsvps(), eventId],
        queryFn: () => getRsvps(eventId),
        staleTime: 5000,
      }),
  };

  const mutations = {
    createEvent: {
      mutationFn: (eventData: LocalEventData) => {
        return createEvent(eventData);
      },
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: queries.all() });
      },
    },
    createRsvp: {
      mutationFn: (data: RsvpData) => {
        return createRsvp(data);
      },
      onSuccess: (data: RsvpData) => {
        console.log("success created rsvp", data);
        void queryClient.invalidateQueries({
          queryKey: queries.rsvps(),
        });
      },
    },
    deleteRsvp: {
      mutationFn: (data: DeleteRsvpProps) => {
        return deleteRsvp(data);
      },
      onSuccess: (data: DeleteRsvpProps) => {
        void queryClient.invalidateQueries({
          queryKey: queries.rsvps(),
        });
      },
    },
  };

  const { doGet, doPatch, doPost, doDelete } = useApiService();

  const getEvent = (id: string) => doGet<LocalEvent>(`/v3/events/${id}`);

  const createEvent = (eventData: LocalEventData) =>
    doPost(`/v3/events`, eventData);

  const updateEvent = (eventId: string, event: LocalEventUpdateData) =>
    doPatch(`/v3/events/${eventId}`, event);

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
    LOG.debug("search", urlSearchParams);

    return doGet<LocalEvent[]>(`/v3/events?${urlSearchParams.toString()}`);
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
    mutations,
    getEvent,
    createEvent,
    updateEvent,
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