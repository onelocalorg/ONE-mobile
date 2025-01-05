import { ImageUrl } from "./image-info";

export interface OneUser extends OneUserData {
  firstName: string;
  lastName?: string;
  pic: ImageUrl;
}

export interface OneUserData {
  id: string;
}
