export interface UserProfile extends UserProfileData {
  id: string;
  firstName: string;
  lastName: string;
  gratis: number;
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
  pic?: string;
  about?: string;
  skills?: string[];
}
