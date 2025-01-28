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

export interface PayoutData {
  id?: string;
  event: {
    id: string;
  };
  payee: OneUser;
  split: PayoutSplit;
  paidAt?: DateTime;
  amount: number;
  description: string;
  images: ImageUrl[];
}
