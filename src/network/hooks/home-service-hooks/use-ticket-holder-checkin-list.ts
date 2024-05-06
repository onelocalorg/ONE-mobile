import { useQuery } from "@tanstack/react-query";
import {
  TickeHolderProps,
  onFetchTicketHolderList,
} from "~/network/api/services/home-service";
import { apiKeys } from "~/network/constant";

export interface Root {
  results: Result[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

export interface Result {
  isCheckedIn: boolean;
  event: Event;
  ticket: string;
  user: User;
  ticket_name: string;
  stripe_response: StripeResponse;
  ticket_price: string;
  ticket_total_price: string;
  _id: string;
  is_app_user: number;
}

export interface Event {
  name: string;
  start_date: string;
  end_date: string;
  about: string;
  address: string;
  full_address: string;
  location: string[];
  email_confirmation_body: string;
  event_image: string;
  eventProducer: string;
  tickets: string[];
  id: string;
}

export interface User {
  first_name: string;
  last_name: string;
  status: string;
  bio: string;
  about: string;
  mobile_number: string;
  email: string;
  user_type: string;
  skills: string[];
  isEmailVerified: boolean;
  access_token?: string;
  refresh_token?: string;
  id: string;
  pic?: string;
  name: string;
}

export interface StripeResponse {
  amount: number;
  canceledAt: any;
  captureMethod: string;
  clientSecret: string;
  confirmationMethod: string;
  created: string;
  currency: string;
  description: string;
  id: string;
  lastPaymentError: any;
  livemode: boolean;
  nextAction: any;
  paymentMethodId: string;
  receiptEmail: any;
  shipping: any;
  status: string;
}

const parsedCheckinsList = (data: Root) => {
  return data;
};

export const useTicketHolderCheckinsList = (props: TickeHolderProps) => {
  const query = useQuery(
    [apiKeys.ticketHolderCheckins],
    () => onFetchTicketHolderList(props),
    { enabled: false, refetchOnWindowFocus: false, staleTime: 0 }
  );

  return { ...query, data: parsedCheckinsList(query?.data?.data) };
};
