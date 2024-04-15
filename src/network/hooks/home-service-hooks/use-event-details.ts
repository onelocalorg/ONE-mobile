import {
  EventDetailsProps,
  onFetchEventDetails,
} from "@network/api/services/home-service";
import { apiKeys } from "@network/constant";
import { useQuery } from "@tanstack/react-query";

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

export interface Ticket {
  name: string;
  start_date: string;
  end_date: string;
  about: string;
  price: string;
  location: string[];
  id: string;
  is_ticket_purchased?: string;
  ticket_purchase_link?: string;
  quantity: string;
  max_quantity_to_show: string;
  available_quantity: any;
}

const parsedEventDetails = (data: EventDetails) => {
  return data;
};

export const useEventDetails = (props: EventDetailsProps) => {
  const query = useQuery(
    [apiKeys.fetchEventDetails],
    () => onFetchEventDetails(props),
    {
      staleTime: 0,
      refetchOnWindowFocus: false,
      enabled: false,
    }
  );

  return { ...query, data: parsedEventDetails(query?.data?.data) };
};
