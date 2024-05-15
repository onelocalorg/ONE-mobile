import { EventProducer } from "./event-producer";

export interface EventResponse {
  id: string;
  name: string;
  start_date: string;
  end_date?: string;
  timezone: string;
  about?: string;
  address?: string;
  full_address: string;
  location: GeoJSON.Point;
  lat: number;
  long: number;
  eventProducer: EventProducer;
  email_confirmation_body: string;
  event_image_id?: string;
  ticketTypes: TicketTypeResponse[];
  isCanceled: boolean;
  viewCount: number;
  isPayout: boolean;
  payoutProcess: string;
  payout: any;
  event_type: string;
  is_event_owner: boolean;
  totalRevenue: number;
}

interface TicketTypeResponse {
  id?: string;
  name: string;
  price: string;
  // is_ticket_purchased?: string;
  // ticket_purchase_link?: string;
  quantity?: number;
  // max_quantity_to_show: string;
  // available_quantity: any;
}
