import { Chapter } from "./chapter";
import { ImageKey, ImageUrl } from "./image-info";
import { OneUser } from "./one-user";

export type SubscriptionType = "free" | "host";
export type BillingInterval = "none" | "monthly" | "yearly";

export interface Me extends UserProfile {
  stripe?: {
    id: string;
    payouts_enabled: boolean;
    requirements: {
      past_due: string[];
      currently_due: string[];
      disabled_reason: string | null;
      errors: [{ code: string; reason: string; requirement: string }];
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
  homeChapter?: Chapter;
}

export const isUserProfile = (
  user: UserProfile | OneUser
): user is UserProfile => "gratis" in user;
