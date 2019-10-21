/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { RESOLUTION } from "./globalTypes";

// ====================================================
// GraphQL query operation: searchNyaaQuery
// ====================================================

export interface searchNyaaQuery_searchNyaa_links {
  __typename: "NyaaLinksType";
  magnet: string;
}

export interface searchNyaaQuery_searchNyaa {
  __typename: "NyaaItemType";
  name: string;
  fileSize: string;
  links: searchNyaaQuery_searchNyaa_links;
  timestamp: string;
}

export interface searchNyaaQuery {
  searchNyaa: searchNyaaQuery_searchNyaa[];
}

export interface searchNyaaQueryVariables {
  searchQuery: string;
  resolution: RESOLUTION;
}
