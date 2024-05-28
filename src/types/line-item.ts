import { LocalEvent } from "./local-event";
import { TicketType } from "./ticket-type";

export enum LineItemTypes {
  TICKET = "ticket",
}

export interface LineItem {
  type: LineItemTypes;
  quantity: number;
  event: LocalEvent;
  ticketType: TicketType;
}
