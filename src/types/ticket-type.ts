import { TicketTypeData } from "./ticket-type-data";

export interface TicketType extends TicketTypeData {
  id: string;
  sold?: number;
  isAvailable?: boolean;
}
