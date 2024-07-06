import { UserProfile } from "./user-profile";

export interface CurrentUser extends UserProfile {
  accessToken: string;
  refreshToken: string;
  email: string;
}
