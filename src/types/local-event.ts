import { LocalEventData } from "./local-event-data";
import { OneUser } from "./one-user";
import { TicketType } from "./ticket-type";

// The data returned from the server for an event
export interface LocalEvent extends LocalEventData {
  id: string;
  host: OneUser;
  ticketTypes: TicketType[];
  isCanceled: boolean;
  viewCount: number;
  timezone: string;
}

export function isLocalEvent(object?: any): object is LocalEvent {
  return !!object && "viewCount" in object;
}
