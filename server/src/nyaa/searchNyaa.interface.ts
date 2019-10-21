
export enum RESOLUTION {
  FULL_HD = '1080p',
  HD = '720p',
  TRASH_QUALITY = '480p',
}

export interface SearchNyaa {
  searchQuery: string;
  resolution: RESOLUTION;
}