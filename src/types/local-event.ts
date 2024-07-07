import { DateTime } from "luxon";
import { ImageKey, ImageUrl } from "./image-info";
import { OneUser } from "./one-user";
import { Post } from "./post";
import { TicketType } from "./ticket-type";
import { TicketTypeData } from "./ticket-type-data";

export interface LocalEvent extends LocalEventData {
  id: string;
  host: OneUser;
  ticketTypes: TicketType[];
  viewCount: number;
  timezone: string;
  images: ImageUrl[];
}

export interface LocalEventData extends Omit<LocalEventUpdateData, "id"> {
  name: string;
  startDate: DateTime;
  coordinates: number[];
  ticketTypes: TicketTypeData[];
  images: ImageKey[];
}

// The data for creating an event.
export interface LocalEventUpdateData {
  id: string;
  name?: string;
  type?: string;
  startDate?: DateTime;
  endDate?: DateTime;
  cancelDate?: DateTime;
  timezone?: string;
  details?: string;
  venue?: string;
  address?: string;
  coordinates?: number[];
  images?: ImageKey[];
  ticketTypes?: TicketTypeData[];
}

export const isEvent = (item: LocalEvent | Post) => "host" in item;
