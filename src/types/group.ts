import { ChapterData } from "./chapter";
import { ImageKey, ImageUrl } from "./image-info";
import { OneUser, OneUserData } from "./one-user";

export interface Group extends GroupData {
  id: string;
  admins: OneUser[];
  editors: OneUser[];
  members: OneUser[];
  chapters: ChapterData[];
  parent: Group | null;
}

export interface GroupData extends GroupUpdateData {
  name: string;
  images: ImageUrl[];
  parentId?: string;
}

export interface GroupUpdateData {
  id: string;
  name?: string;
  chapters?: ChapterData[];
  summary?: string;
  details?: string;
  venue?: string;
  address?: string;
  coordinates?: number[];
  admins?: OneUserData[];
  members?: OneUserData[];
  images?: ImageKey[];
}
