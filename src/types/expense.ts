import { ImageUrl } from "./image-info";
import { OneUser } from "./one-user";
import { PaymentStatus } from "./payment";

export interface Expense extends ExpenseData {
  id: string;
  status: PaymentStatus;
}

export interface ExpenseData extends Omit<ExpenseUpdateData, "id"> {
  payee: OneUser;
  amount: number;
  description: string;
  images?: ImageUrl[];
}

export interface ExpenseUpdateData {
  id: string;
  event: {
    id: string;
  };
  payee?: OneUser;
  amount?: number;
  description?: string;
  images?: ImageUrl[];
}
