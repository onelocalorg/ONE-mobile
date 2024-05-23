import Big from "big.js";

export interface TicketTypeData {
  name: string;
  price: Big;
  quantity?: number;
}
