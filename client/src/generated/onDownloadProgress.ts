/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: onDownloadProgress
// ====================================================

export interface onDownloadProgress_downloadProgress {
  __typename: "DownloadProgressType";
  animeName: string;
  fileName: string;
  progress: number;
  downloadSpeed: number;
}

export interface onDownloadProgress {
  downloadProgress: onDownloadProgress_downloadProgress[];
}
