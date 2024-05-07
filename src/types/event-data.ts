import { DateTime } from "luxon";
import { EventProducer } from "./event-producer";
import { TicketType } from "./ticket-type";

export interface EventData {
  name: string;
  start_date: DateTime;
  end_date?: DateTime;
  about?: string;
  address?: string;
  full_address?: string;
  location: string[];
  email_confirmation_body?: string;
  event_image?: string;
  eventProducer: EventProducer;
  tickets: TicketType[];
  id: string;
  is_event_owner: boolean;
  quantity: string;
  max_quantity_to_show: string;
  available_quantity: string;
  cancelled: boolean;
  date_title: string;
  day_title: string;
  isPayout: boolean;
  viewCount: number;
  start_time_label: string;
  start_date_label: string;
  events: [];
  lat: number;
  long: number;
  event_image_id?: string;
}
