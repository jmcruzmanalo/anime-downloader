/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum RESOLUTION {
  FULL_HD = "FULL_HD",
  HD = "HD",
  TRASH_QUALITY = "TRASH_QUALITY",
}

export enum TORRENT_STATUS {
  DONE = "DONE",
  DOWNLOADING = "DOWNLOADING",
  PAUSED = "PAUSED",
  SCANNING = "SCANNING",
}

export interface NyaaItemInput {
  name: string;
  fileSize: string;
  links: NyaaLinksInput;
}

export interface NyaaLinksInput {
  magnet: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
