import { EventProducer } from "./event-producer";
import { LocalEventData } from "./local-event-data";

export interface LocalEvent extends LocalEventData {
  id: string;
  event_image?: string;
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
