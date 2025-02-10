import { ChapterData } from "./chapter";
import { ImageKey, ImageUrl } from "./image-info";
import { OneUser } from "./one-user";

export type SubscriptionType = "free" | "host";
export type BillingInterval = "none" | "monthly" | "yearly";

export interface Me extends UserProfile {
  stripe?: {
    id: string;
    requirements: {
      currently_due: string[];
    };
  };
}

export interface UserProfile extends UserProfileData {
  id: string;
  firstName: string;
  lastName?: string;
  gratis: number;
  pic?: ImageUrl;
  isEmailVerified: boolean;
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
  homeChapter?: ChapterData;
}

export const isUserProfile = (
  user: UserProfile | OneUser
): user is UserProfile => "gratis" in user;
