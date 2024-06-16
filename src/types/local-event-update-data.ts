import { DateTime } from "luxon";
import { TicketTypeData } from "./ticket-type-data";

// The data for creating an event.
export interface LocalEventUpdateData {
  name?: string;
  type?: string;
  startDate?: DateTime;
  endDate?: DateTime;
  timezone?: string;
  about?: string;
  venue?: string;
  address?: string;
  coordinates?: number[];
  image?: string;
  ticketTypes?: TicketTypeData[];
  isCanceled?: boolean;
}
