import { queryOptions, useQueryClient } from "@tanstack/react-query";
import _ from "lodash/fp";
import { EventFinancials } from "~/types/event-financials";
import { Expense, ExpenseData, ExpenseUpdateData } from "~/types/expense";
import {
  LocalEvent,
  LocalEventData,
  LocalEventUpdateData,
} from "~/types/local-event";
import { Payout, PayoutData, PayoutUpdateData } from "~/types/payout";
import { PriceBreakdown } from "~/types/price-breakdown";
import { Rsvp, RsvpData, RsvpList } from "~/types/rsvp";
import { TicketSelection } from "~/types/ticket-selection";
import { Transfer } from "~/types/transfer";
import { useApiService } from "./ApiService";

export enum EventMutations {
  createEvent = "createEvent",
  editEvent = "editEvent",
  cancelEvent = "cancelEvent",
  createRsvp = "createRsvp",
  deleteRsvp = "deleteRsvp",
  createExpense = "createExpense",
  editExpense = "editExpense",
  deleteExpense = "deleteExpense",
  sendExpense = "sendExpense",
  createPayout = "createPayout",
  editPayout = "editPayout",
  deletePayout = "deletePayout",
  sendPayout = "sendPayout",
}

export function useEventService() {
  const queryClient = useQueryClient();

  const queries = {
    all: () => ["events"],
    lists: () => [...queries.all(), "lists"],
    list: (filters?: GetEventsParams) =>
      queryOptions({
        queryKey: [...queries.lists(), filters],
        queryFn: () => getEvents(filters),
      }),
    details: () => [...queries.all(), "details"],
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
    financials: () => [...queries.all(), "financials"],
    financialsForEvent: (eventId: string) =>
      queryOptions({
        queryKey: [...queries.financials(), eventId],
        queryFn: () => getFinancials(eventId),
        staleTime: 5000,
      }),
    expenses: () => [...queries.financials(), "expenses"],
    expensesForEvent: (eventId: string) =>
      queryOptions({
        queryKey: [...queries.financialsForEvent(eventId).queryKey, "expenses"],
        queryFn: () => getExpenses(eventId),
        staleTime: 5000,
      }),
    expenseDetail: (expenseId: PaymentId) =>
      queryOptions({
        queryKey: [
          ...queries.expensesForEvent(expenseId.eventId).queryKey,
          expenseId.id,
        ],
        queryFn: () => getExpense(expenseId),
        staleTime: 5000,
      }),
    payouts: () => [...queries.financials(), "payouts"],
    payoutsForEvent: (eventId: string) =>
      queryOptions({
        queryKey: [...queries.financialsForEvent(eventId).queryKey, "payouts"],
        queryFn: () => getPayouts(eventId),
        staleTime: 5000,
      }),
    payoutDetail: (paymentId: PaymentId) =>
      queryOptions({
        queryKey: [
          ...queries.payoutsForEvent(paymentId.eventId).queryKey,
          paymentId.id,
        ],
        queryFn: () => getPayout(paymentId),
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

  queryClient.setMutationDefaults([EventMutations.createExpense], {
    mutationFn: (data: ExpenseData) => {
      return createExpense(data);
    },
    onSuccess: (result: Expense) => {
      void queryClient.invalidateQueries({
        queryKey: queries.financialsForEvent(result.event.id).queryKey,
      });
    },
  });
  queryClient.setMutationDefaults([EventMutations.editExpense], {
    mutationFn: (data: ExpenseUpdateData) => {
      return updateExpense(data);
    },
    onSuccess: (result: Expense) => {
      console.log(
        "invalidate",
        queries.financialsForEvent(result.event.id).queryKey
      );
      void queryClient.invalidateQueries({
        queryKey: queries.financialsForEvent(result.event.id).queryKey,
      });
    },
  });
  queryClient.setMutationDefaults([EventMutations.deleteExpense], {
    mutationFn: (data: PaymentId) => {
      return deleteExpense(data);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queries.financials(),
      });
    },
  });
  queryClient.setMutationDefaults([EventMutations.sendExpense], {
    mutationFn: (data: PaymentId) => {
      return sendExpense(data);
    },
    onSuccess: (result: Transfer) => {
      void queryClient.invalidateQueries({
        queryKey: queries.expensesForEvent(result.event.id).queryKey,
      });
    },
  });

  queryClient.setMutationDefaults([EventMutations.createPayout], {
    mutationFn: (data: PayoutData) => {
      return createPayout(data);
    },
    onSuccess: (result: Payout) => {
      void queryClient.invalidateQueries({
        queryKey: queries.financialsForEvent(result.event.id).queryKey,
      });
    },
  });
  queryClient.setMutationDefaults([EventMutations.editPayout], {
    mutationFn: (data: PayoutUpdateData) => {
      return updatePayout(data);
    },
    onSuccess: (result: Payout) => {
      void queryClient.invalidateQueries({
        queryKey: queries.financialsForEvent(result.event.id).queryKey,
      });
    },
  });
  queryClient.setMutationDefaults([EventMutations.deletePayout], {
    mutationFn: (data: PaymentId) => {
      return deletePayout(data);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queries.financials(),
      });
    },
  });
  queryClient.setMutationDefaults([EventMutations.sendPayout], {
    mutationFn: (data: PaymentId) => {
      return sendPayout(data);
    },
    onSuccess: (result: Transfer) => {
      void queryClient.invalidateQueries({
        queryKey: queries.payoutsForEvent(result.event.id).queryKey,
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

  const getFinancials = (eventId: string) => {
    return doGet<EventFinancials>(`/v3/events/${eventId}/financials`);
  };

  const getExpenses = async (eventId: string) => {
    return doGet<Expense[]>(`/v3/events/${eventId}/expenses`);
  };

  const getExpense = async ({
    id,
    eventId,
  }: {
    id: string;
    eventId: string;
  }) => {
    return doGet<Expense>(`/v3/events/${eventId}/expenses/${id}`);
  };

  const createExpense = (data: ExpenseData) => {
    return doPost<Expense>(
      `/v3/events/${data.event.id}/expenses`,
      _.omit(["event", "payee"], {
        ...data,
        payeeId: data.payee.id,
      })
    );
  };

  const updateExpense = (data: ExpenseUpdateData) => {
    console.log("updateExpense", data);
    return doPatch<Expense>(
      `/v3/events/${data.event.id}/expenses/${data.id}`,
      _.omit(["id", "event", "payee", "createdAt", "transfers", "status"], {
        ...data,
        payeeId: data.payee?.id,
      })
    );
  };

  const deleteExpense = ({ id, eventId }: PaymentId) => {
    return doDelete<Expense>(`/v3/events/${eventId}/expenses/${id}`);
  };

  const sendExpense = ({ id, eventId }: PaymentId) => {
    return doPost<Expense>(`/v3/events/${eventId}/expenses/${id}/send`);
  };

  const getPayouts = async (eventId: string) => {
    return doGet<Payout[]>(`/v3/events/${eventId}/payouts`);
  };

  const getPayout = async ({
    id,
    eventId,
  }: {
    id: string;
    eventId: string;
  }) => {
    return doGet<Payout>(`/v3/events/${eventId}/payouts/${id}`);
  };

  const createPayout = (data: PayoutData) => {
    return doPost<Payout>(
      `/v3/events/${data.event.id}/payouts`,
      _.omit(["event", "payee"], {
        ...data,
        payeeId: data.payee.id,
      })
    );
  };

  const updatePayout = (data: PayoutUpdateData) => {
    return doPatch<Payout>(
      `/v3/events/${data.event.id}/payouts/${data.id}`,
      _.omit(["id", "event", "payee", "createdAt", "transfers", "status"], {
        ...data,
        payeeId: data.payee?.id,
      })
    );
  };

  const deletePayout = ({ id, eventId }: PaymentId) => {
    return doDelete<Payout>(`/v3/events/${eventId}/payouts/${id}`);
  };

  const sendPayout = ({ id, eventId }: PaymentId) => {
    return doPost<Transfer>(`/v3/events/${eventId}/payouts/${id}/send`);
  };

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
    queryClient,
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
