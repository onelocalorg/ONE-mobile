import { ImageKey, ImageUrl } from "./image-info";
import { OneUser, OneUserData } from "./one-user";

export interface Group extends GroupData {
  id: string;
  admins: OneUser[];
  images: ImageUrl[];
}

export interface GroupData extends GroupUpdateData {
  parentId?: string;
  name: string;
}

export interface GroupUpdateData {
  id: string;
  parentId?: string;
  name?: string;
  chapterId?: string;
  summary?: string;
  details?: string;
  venue?: string;
  address?: string;
  coordinates?: number[];
  admins?: OneUserData[];
  images?: ImageKey[];
}
