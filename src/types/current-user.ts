import { UserProfile } from "./user-profile";

export interface CurrentUser extends UserProfile {
  access_token: string;
  refresh_token: string;
}
