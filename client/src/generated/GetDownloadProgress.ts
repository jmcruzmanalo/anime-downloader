/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetDownloadProgress
// ====================================================

export interface GetDownloadProgress_downloadProgress {
  __typename: "DownloadProgressType";
  fileName: string;
  animeName: string;
  downloadSpeed: number;
  progress: number;
}

export interface GetDownloadProgress {
  downloadProgress: GetDownloadProgress_downloadProgress[];
}
