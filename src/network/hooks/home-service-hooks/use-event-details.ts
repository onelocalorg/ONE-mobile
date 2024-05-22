import { useQuery } from "@tanstack/react-query";
import _ from "lodash/fp";
import { DateTime } from "luxon";
import { LOG } from "~/config";
import { onFetchEventDetails } from "~/network/api/services/event-service";
import { apiKeys } from "~/network/constant";
import { LocalEvent } from "~/types/local-event";
import { TicketType } from "~/types/ticket-type";

export interface EventDetails {
  name: string;
  start_date: string;
  end_date: string;
  about: string;
  address: string;
  full_address: string;
  location: string[];
  email_confirmation_body: string;
  event_image: string;
  eventProducer: EventProducer;
  ticketTypes: TicketType[];
  id: string;
  is_event_owner: boolean;
  quantity: string;
  max_quantity_to_show: string;
  available_quantity: string;
  cancelled: any;
  isCanceled: boolean;
  isPayout: boolean;
  viewCount: number;
  start_date_label: string;
  start_time_label: string;
  events: [];
  lat: number | undefined;
  long: number | undefined;
  event_image_id: string;
}

interface EventProducer {
  first_name: string;
  last_name: string;
  status: string;
  bio: string;
  pic: string;
  about: string;
  email: string;
  mobile_number: string;
  user_type: string;
  skills: string[];
  isEmailVerified: boolean;
  access_token: string;
  refresh_token: string;
  id: string;
}

const parsedEventDetails = (data: EventDetails) => {
  LOG.debug("parsedEventDetails", data);
  return {
    ..._.omit(["lat", "long"], data),
    start_date: DateTime.fromISO(data.start_date),
    end_date: DateTime.fromISO(data.end_date),
    latitude: data.lat,
    longitude: data.long,
  } as LocalEvent;
};

export const useEventDetails = (eventId: string) => {
  const query = useQuery(
    [apiKeys.fetchEventDetails],
    () => onFetchEventDetails(eventId),
    {
      staleTime: 0,
      refetchOnWindowFocus: false,
      enabled: false,
    }
  );

  return { ...query, data: parsedEventDetails(query?.data?.data) };
};
