import { ImageKey, ImageUrl } from "./image-info";

export interface UserProfile extends UserProfileData {
  id: string;
  firstName: string;
  lastName: string;
  gratis: number;
  pic: ImageUrl;
}

export interface UserProfileData extends UserProfileUpdateData {
  firstName: string;
  lastName: string;
  skills: string[];
}

export interface UserProfileUpdateData {
  id: string;
  firstName?: string;
  lastName?: string;
  nickname?: string;
  catchphrase?: string;
  pic?: ImageKey;
  about?: string;
  skills?: string[];
  messagingToken?: string;
}
