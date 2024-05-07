import { useMutation } from "@tanstack/react-query";
import { onFetchEvents } from "~/network/api/services/home-service";
import { EventData } from "~/types/event-data";

interface Root {
  results: EventData[];
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
