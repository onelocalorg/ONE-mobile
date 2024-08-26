import { DateTime } from "luxon";
import { ImageUrl } from "./image-info";
import { OneUser } from "./one-user";

export interface Payment extends PaymentData {
  id: string;
}

export enum PaymentType {
  Expense = "expense",
  Payout = "payout",
}

export enum PaymentSplit {
  Fixed = "fixed",
  Percent = "percent",
}

export interface PaymentData {
  id?: string;
  eventId: string;
  payee: OneUser;
  paymentType: PaymentType;
  paymentSplit: PaymentSplit;
  paidAt?: DateTime;
  amount: number;
  description: string;
  images: ImageUrl[];
}
