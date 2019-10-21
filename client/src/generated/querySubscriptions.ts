/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { RESOLUTION } from "./globalTypes";

// ====================================================
// GraphQL query operation: querySubscriptions
// ====================================================

export interface querySubscriptions_subscribedEpisodes_episodes_links {
  __typename: "NyaaLinksType";
  magnet: string;
}

export interface querySubscriptions_subscribedEpisodes_episodes {
  __typename: "NyaaItemType";
  name: string;
  fileSize: string;
  nbDownload: string;
  links: querySubscriptions_subscribedEpisodes_episodes_links;
}

export interface querySubscriptions_subscribedEpisodes {
  __typename: "SubscribedAnimeType";
  animeName: string;
  resolution: RESOLUTION;
  episodes: querySubscriptions_subscribedEpisodes_episodes[];
}

export interface querySubscriptions {
  subscribedEpisodes: querySubscriptions_subscribedEpisodes[];
}
