import { DateTime } from "luxon";
import { PostType } from "./post-data";

// The data for updateing an existing post
export interface PostUpdateData {
  type: PostType;
  name?: string;
  details?: string;
  address?: string;
  coordinates?: number[];
  startDate?: DateTime;
  timezone?: string;
  images?: string[];
}
