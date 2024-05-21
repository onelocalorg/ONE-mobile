import { DateTime } from "luxon";

// The data for creating a post
export interface PostData {
  type: string;
  name: string;
  // what_quantity: whatQuantity,
  // for_type: whatForType,
  // for_name: forName ? forName : undefined,
  // for_quantity: forQuantity ? forQuantity : undefined,
  address?: string;
  latitude?: number;
  longitude?: number;
  startDate?: DateTime;
  hasTime?: boolean;
  details?: string;
  // tags: tagArray ? tagArray : undefined,
  imageUrls?: string[];
  // to_type: valueTotype,
  // to_offer_users: userListArray,
}
