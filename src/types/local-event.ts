import { DateTime } from "luxon";
import { ImageKey, ImageUrl } from "./image-info";
import { Mappable } from "./mappable";
import { OneUser } from "./one-user";
import { TicketType } from "./ticket-type";
import { TicketTypeData } from "./ticket-type-data";

export interface MappableLocalEvent
  extends Omit<LocalEvent, "startDate">,
    Mappable {
  coordinates: number[];
}

export interface LocalEvent extends LocalEventData {
  id: string;
  host: OneUser;
  ticketTypes: TicketType[];
  viewCount: number;
  timezone: string;
  image?: ImageUrl;
}

export interface LocalEventData extends Omit<LocalEventUpdateData, "id"> {
  name: string;
  startDate: DateTime;
  coordinates: number[];
  ticketTypes: TicketTypeData[];
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
  about?: string;
  venue?: string;
  address?: string;
  coordinates?: number[];
  image?: ImageKey;
  ticketTypes?: TicketTypeData[];
}

export function isLocalEvent(object?: any): object is LocalEvent {
  return !!object && "viewCount" in object;
}
