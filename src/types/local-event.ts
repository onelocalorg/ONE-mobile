import { EventProducer } from "./event-producer";
import { LocalEventData } from "./local-event-data";
import { TicketType } from "./ticket-type";

// The data returned from the server for an event
export interface LocalEvent extends LocalEventData {
  id: string;
  eventProducer: EventProducer;
  ticketTypes: TicketType[];
  is_event_owner: boolean;
  // quantity: string;
  // max_quantity_to_show: string;
  // available_quantity: string;
  // cancelled: any;
  isCanceled: boolean;
  isPayout: boolean;
  viewCount: number;
  timeOffset: string;
}

export function isLocalEvent(object?: any): object is LocalEvent {
  return !!object && "viewCount" in object;
}
