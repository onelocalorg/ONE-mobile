import { ImageUrl } from "./image-info";
import { OneUser } from "./one-user";
import { PaymentStatus } from "./payment";

export interface Payout extends PayoutData {
  id: string;
  status: PaymentStatus;
}

export enum PayoutSplit {
  Fixed = "fixed",
  Percent = "percent",
}

export interface PayoutData extends Omit<PayoutUpdateData, "id"> {
  payee: OneUser;
  split: PayoutSplit;
  amount: number;
  description: string;
  images?: ImageUrl[];
}

export interface PayoutUpdateData {
  id: string;
  event: {
    id: string;
  };
  payee?: OneUser;
  split?: PayoutSplit;
  amount?: number;
  description?: string;
  images?: ImageUrl[];
}
