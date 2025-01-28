import { DateTime } from "luxon";
import { ImageUrl } from "./image-info";
import { OneUser } from "./one-user";

export interface Expense extends ExpenseData {
  id: string;
}

export interface ExpenseData {
  id?: string;
  event: {
    id: string;
  };
  payee: OneUser;
  paidAt?: DateTime;
  amount: number;
  description: string;
  images: ImageUrl[];
}
