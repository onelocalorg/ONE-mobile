import { DateTime } from "luxon";
import { LocalEventUpdateData } from "./local-event-update-data";
import { TicketTypeData } from "./ticket-type-data";

// The data for creating an event.
export interface LocalEventData extends LocalEventUpdateData {
  id?: string;
  name: string;
  startDate: DateTime;
  coordinates: number[];
  ticketTypes: TicketTypeData[];
}
