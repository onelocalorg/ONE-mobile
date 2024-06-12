import { DateTime } from "luxon";

// The data for updateing an existing post
export interface PostUpdateData {
  type: string;
  name?: string;
  details?: string;
  address?: string;
  coordinates?: number[];
  startDate?: DateTime;
  timezone?: string;
  images?: string[];
}
