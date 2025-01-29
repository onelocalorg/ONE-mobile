import { ImageKey, ImageUrl } from "./image-info";
import { OneUser } from "./one-user";

export interface UserProfile extends UserProfileData {
  id: string;
  firstName: string;
  lastName?: string;
  gratis: number;
  pic?: ImageUrl;
  isEmailVerified: boolean;
  chapterId?: string;
}

export interface UserProfileData extends UserProfileUpdateData {
  firstName: string;
  lastName?: string;
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
}

export const isUserProfile = (
  user: UserProfile | OneUser
): user is UserProfile => "gratis" in user;
