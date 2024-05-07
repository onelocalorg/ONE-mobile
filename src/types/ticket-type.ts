import Big from "big.js";

export interface TicketType {
  id?: string;
  name: string;
  price: Big;
  // is_ticket_purchased?: string;
  // ticket_purchase_link?: string;
  quantity?: number;
  // max_quantity_to_show: string;
  // available_quantity: any;
}
