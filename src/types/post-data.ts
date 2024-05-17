export interface PostData {
  type: "offer";
  // what_type: whatSelectType,
  what_name: string;
  // what_quantity: whatQuantity,
  // for_type: whatForType,
  // for_name: forName ? forName : undefined,
  // for_quantity: forQuantity ? forQuantity : undefined,
  where_address?: string;
  where_lat?: string;
  where_lng?: string;
  when?: string;
  content?: string;
  // tags: tagArray ? tagArray : undefined,
  post_image?: string[];
  // to_type: valueTotype,
  // to_offer_users: userListArray,
}
