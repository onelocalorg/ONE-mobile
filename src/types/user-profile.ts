import { UserProfileData } from "./user-profile-data";

export interface UserProfile extends UserProfileData {
  id: string;
  location: GeoJSON.Point;
  customer_id: string;
  first_name: string;
  last_name: string;
  nick_name: string;
  catch_phrase: string;
  pic: string;
  cover_image: string;
  about: string;
  skills: string[];
  user_type: string;
  isThisUser: boolean;
  points_balance: number;
  isActiveSubscription: boolean;
  coverImage: string;
  profile_answers: string[];
  eventProducerPackageId: string;
  isOrgActiveSubscription: boolean;
  isPlayerActiveSubscription: boolean;
  isServiceActiveSubscription: boolean;
  isEventActiveSubscription: boolean;
  isConnectedLinked: boolean;
}
