import { LocalEventData } from "~/types/local-event-data";

interface Root {
  results: LocalEventData[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}
