import { DateTime } from "luxon";
import { TicketTypeData } from "./ticket-type-data";

// The data for creating an event.
export interface LocalEventUpdateData {
  name?: string;
  type?: string;
  startDate?: DateTime;
  endDate?: DateTime;
  about?: string;
  address?: string;
  fullAddress?: string;
  latitude?: number;
  longitude?: number;
  eventImage?: string;
  emailConfirmationBody?: string;
  ticketTypes?: TicketTypeData[];
  isCanceled?: boolean;
}
