export interface NewUser {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  confirmPassword?: string;
  pic?: string;
}
