import { DateTime } from "luxon";
import { OneUser } from "./one-user";
import { TicketType } from "./ticket-type";
import { TicketTypeData } from "./ticket-type-data";

export interface LocalEvent extends LocalEventData {
  id: string;
  host: OneUser;
  ticketTypes: TicketType[];
  isCanceled: boolean;
  viewCount: number;
  timezone: string;
}

export interface LocalEventData extends LocalEventUpdateData {
  name: string;
  startDate: DateTime;
  coordinates: number[];
  ticketTypes: TicketTypeData[];
}

// The data for creating an event.
export interface LocalEventUpdateData {
  id: string;
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

export function isLocalEvent(object?: any): object is LocalEvent {
  return !!object && "viewCount" in object;
}
