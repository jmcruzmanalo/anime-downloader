/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { TORRENT_STATUS } from "./globalTypes";

// ====================================================
// GraphQL subscription operation: onDownloadProgress
// ====================================================

export interface onDownloadProgress_downloadProgress {
  __typename: "DownloadProgressType";
  animeName: string;
  fileName: string;
  progress: number;
  downloadSpeed: number;
  status: TORRENT_STATUS;
}

export interface onDownloadProgress {
  downloadProgress: onDownloadProgress_downloadProgress[];
}
