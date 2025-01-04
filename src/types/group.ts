import { ImageKey, ImageUrl } from "./image-info";

export interface Group extends GroupData {
  id: string;
  pic: ImageUrl;
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
  pic?: ImageKey;
}
