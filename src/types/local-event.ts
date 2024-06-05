import { EventProducer } from "./event-producer";
import { LocalEventData } from "./local-event-data";

// The data returned from the server for an event
export interface LocalEvent extends LocalEventData {
  id: string;
  eventProducer: EventProducer;
  is_event_owner: boolean;
  // quantity: string;
  // max_quantity_to_show: string;
  // available_quantity: string;
  // cancelled: any;
  isCanceled: boolean;
  isPayout: boolean;
  viewCount: number;
}

export function isLocalEvent(object?: any): object is LocalEvent {
  return !!object && "viewCount" in object;
}
