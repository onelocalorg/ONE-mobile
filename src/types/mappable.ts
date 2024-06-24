import { DateTime } from "luxon";
import { ImageUrl } from "./image-info";

export interface Mappable {
  id: string;
  name: string;
  about?: string;
  startDate?: DateTime;
  timezone: string;
  image?: ImageUrl;
  venue?: string;
  address?: string;
  coordinates: number[];
}
