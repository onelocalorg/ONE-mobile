import { ChapterData, ChapterUpdateData } from "./chapter";
import { ImageKey, ImageUrl } from "./image-info";
import { OneUser, OneUserData } from "./one-user";

export interface Group extends GroupData {
  id: string;
  admins: OneUser[];
  editors: OneUser[];
  members: OneUser[];
  images: ImageUrl[];
  chapters: ChapterData[];
  parent: Group | null;
}

export interface GroupData extends GroupUpdateData {
  parentId?: string;
  name: string;
}

export interface GroupUpdateData {
  id: string;
  name?: string;
  chapters?: ChapterUpdateData[];
  summary?: string;
  details?: string;
  venue?: string;
  address?: string;
  coordinates?: number[];
  admins?: OneUserData[];
  members?: OneUserData[];
  images?: ImageKey[];
}
