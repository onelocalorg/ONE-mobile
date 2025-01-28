import { DateTime } from "luxon";
import { ImageUrl } from "./image-info";
import { OneUser } from "./one-user";

export interface Payout extends PayoutData {
  id: string;
}

export enum PayoutSplit {
  Fixed = "fixed",
  Percent = "percent",
}

export interface PayoutData extends Omit<PayoutUpdateData, "id"> {
  payee: OneUser;
  paidAt?: DateTime;
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
