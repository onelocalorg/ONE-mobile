import { DateTime } from "luxon";
import { TicketType } from "./ticket-type";

// The data for creating an event.
export interface LocalEventData {
  id?: string;
  name: string;
  type?: string;
  start_date: DateTime;
  end_date?: DateTime;
  about?: string;
  address?: string;
  full_address?: string;
  latitude: number;
  longitude: number;
  event_image?: string;
  email_confirmation_body?: string;
  ticketTypes: TicketType[];
  isCanceled?: boolean;
}
