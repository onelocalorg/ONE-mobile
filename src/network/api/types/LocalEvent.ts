import _ from "lodash/fp";
import { DateTime } from "luxon";
import { EventProducer } from "~/types/event-producer";
import { LocalEvent } from "~/types/local-event";
import { LocalEventUpdateData } from "~/types/local-event-update-data";
import { TicketType } from "~/types/ticket-type";

export const resourceToLocalEvent = (data: EventResource) =>
  ({
    ..._.omit(
      ["start_date", "end_date", "lat", "long", "event_image", "full_address"],
      data
    ),
    startDate: DateTime.fromISO(data.start_date),
    endDate: data.end_date ? DateTime.fromISO(data.end_date) : undefined,
    latitude: data.lat,
    longitude: data.long,
    eventImage: data.event_image,
    fullAddress: data.full_address,
    ticketTypes:
      data.ticketTypes?.map((tt) => ({
        ...tt,
        price: tt.price,
      })) ?? [],
  } as LocalEvent);

export const localEventToBody = (data: LocalEventUpdateData) =>
  ({
    name: data.name,
    startDate: data.startDate?.toISO(),
    endDate: data.endDate?.toISO(),
    about: data.about,
    address: data.address,
    full_address: data.fullAddress,
    email_confirmation_body: data.emailConfirmationBody,
    ticketTypes: data.ticketTypes,
    event_lat: data.latitude,
    event_lng: data.longitude,
    event_type: data.type,
    event_image: data.eventImage,
  } as EventBody);

interface CreateEventBody {
  name: string;
  start_date: string;
  timeOffset: string;
  lat: number;
  lng: number;
}

interface EventBody {
  name?: string;
  start_date?: string;
  end_date?: string;
  timeOffset?: string;
  about?: string;
  address?: string;
  full_address?: string;
  location?: GeoJSON.Point;
  lat?: number;
  long?: number;
  eventProducer?: EventProducer;
  email_confirmation_body?: string;
  event_image?: string;
  ticketTypes?: TicketType[];
  isCanceled?: boolean;
  event_type?: string;
}

export interface EventResource extends EventBody {
  id: string;
  name: string;
  start_date: string;
  full_address: string;
  location: GeoJSON.Point;
  lat: number;
  long: number;
  eventProducer: EventProducer;
  email_confirmation_body: string;
  ticketTypes: TicketType[];
  isCanceled: boolean;
  viewCount: number;
  isPayout: boolean;
  payoutProcess: string;
  payout: any;
  event_type: string;
  is_event_owner: boolean;
  totalRevenue: number;
}
