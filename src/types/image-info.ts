export interface ImageUrl extends ImageKey {
  url: string;
}

export interface ImageKey {
  key: string;
  url?: string;
}
