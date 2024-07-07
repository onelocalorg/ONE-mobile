import { ImageKey } from "./image-info";

export interface NewUser {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  confirmPassword?: string;
  pic?: ImageKey;
}
