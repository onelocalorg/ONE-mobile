import { onFetchEvents } from "~/network/api/services/home-service";
import { useMutation } from "@tanstack/react-query";
import { DateTime } from "luxon";

interface Root {
  results: EventData[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

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
  tickets: Ticket[];
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

export interface Ticket {
  name: string;
  start_date: string;
  end_date: string;
  price: string;
  id?: string;
  is_ticket_purchased?: string;
  quantity: string;
  max_quantity_to_show: string;
  available_quantity: any;
}

const parsedEventLists = (data: Root) => {
  return data;
};

export const useEventLists = () => {
  const query = useMutation(onFetchEvents);

  return { ...query, data: parsedEventLists(query?.data?.data) };
};
