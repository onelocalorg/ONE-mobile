import { useMutation } from "@tanstack/react-query";
import { onFetchEvents } from "~/network/api/services/home-service";
import { LocalEventData } from "~/types/local-event-data";

interface Root {
  results: LocalEventData[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

const parsedEventLists = (data: Root) => {
  return data;
};

export const useEventLists = () => {
  const query = useMutation(onFetchEvents);

  return { ...query, data: parsedEventLists(query?.data?.data) };
};
