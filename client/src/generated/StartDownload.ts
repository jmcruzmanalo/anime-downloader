/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { NyaaItemInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: StartDownload
// ====================================================

export interface StartDownload_startDownload {
  __typename: "NyaaItemType";
  name: string;
}

export interface StartDownload {
  startDownload: StartDownload_startDownload;
}

export interface StartDownloadVariables {
  nyaaItem: NyaaItemInput;
}
