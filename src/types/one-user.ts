export interface OneUser extends OneUserData {
  firstName: string;
  lastName?: string;
  pic?: string;
}

export interface OneUserData {
  id: string;
  firstName?: string;
  lastName?: string;
  pic?: string;
}
