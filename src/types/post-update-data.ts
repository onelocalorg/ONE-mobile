import { DateTime } from "luxon";

// The data for updateing an existing post
export interface PostUpdateData {
  type: string;
  name?: string;
  address?: string;
  location?: GeoJSON.Point;
  latitude?: number;
  longitude?: number;
  startDate?: DateTime;
  hasStartTime?: boolean;
  details?: string;
  tags?: string[];
  event_image?: string;
}
