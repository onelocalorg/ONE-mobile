import { ImageKey, ImageUrl } from "./image-info";

export enum UserType {
  Explorer = "explorer",
  Player = "player",
  EventProducer = "eventProducer",
}

export interface UserProfile extends UserProfileData {
  id: string;
  firstName: string;
  lastName?: string;
  gratis: number;
  pic: ImageUrl;
  isEmailVerified: boolean;
  type: UserType;
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
