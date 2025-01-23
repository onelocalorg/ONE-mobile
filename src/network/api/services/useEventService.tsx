import { queryOptions, useQueryClient } from "@tanstack/react-query";
import _ from "lodash/fp";
import {
  LocalEvent,
  LocalEventData,
  LocalEventUpdateData,
} from "~/types/local-event";
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
    rsvps: () => ["rsvps"],
    rsvpsForEvent: (eventId: string) =>
      queryOptions({
        queryKey: [...queries.rsvps(), eventId],
        queryFn: () => getRsvps(eventId),
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
  queryClient.setMutationDefaults(["createRsvp"], {
    mutationFn: (data: RsvpData) => {
      return createRsvp(data);
    },
    onSuccess: (data: RsvpData) => {
      void queryClient.invalidateQueries({
        queryKey: queries.rsvps(),
      });
    },
  });
  queryClient.setMutationDefaults(["deleteRsvp"], {
    mutationFn: (data: DeleteRsvpProps) => {
      return deleteRsvp(data);
    },
    onSuccess: (data: DeleteRsvpProps) => {
      void queryClient.invalidateQueries({
        queryKey: queries.rsvps(),
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
    chapterId?: string;
    groupIds?: string[] | null;
  };
  const getEvents = ({
    isPast,
    isCanceled,
    host,
    chapterId,
    groupIds,
  }: GetEventsParams | undefined = {}) => {
    const urlParams: string[] = [];
    if (!_.isUndefined(isPast)) urlParams.push(`past=${isPast.toString()}`);
    if (!_.isUndefined(isCanceled))
      urlParams.push(`canceled=${isCanceled.toString()}`);
    if (!_.isUndefined(host)) urlParams.push(`host=${host}`);
    if (!_.isUndefined(chapterId)) urlParams.push(`chapter=${chapterId}`);
    if (!_.isUndefined(groupIds)) {
      urlParams.push(
        groupIds ? groupIds.map((g) => `group=${g}`).join("&") : "group=null"
      );
    }

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
