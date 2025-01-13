import { ChapterData, ChapterUpdateData } from "./chapter";
import { ImageKey, ImageUrl } from "./image-info";
import { OneUser, OneUserData } from "./one-user";

export interface Group extends GroupData {
  id: string;
  parentId?: string;
  admins: OneUser[];
  editors: OneUser[];
  members: OneUser[];
  chapters: ChapterData[];
  parent: Group | null;
}

export interface GroupData extends GroupUpdateData {
  name: string;
  images: ImageUrl[];
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
