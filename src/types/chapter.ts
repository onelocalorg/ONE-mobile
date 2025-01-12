export interface Chapter extends ChapterData {
  coordinates: number[];
  zoom: number;
}

export interface ChapterData extends ChapterUpdateData {
  name: string;
}

export interface ChapterUpdateData {
  id: string;
  name?: string;
  coordinates?: number[];
  zoom?: number;
}
