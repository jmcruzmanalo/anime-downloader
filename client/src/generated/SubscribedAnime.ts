/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SubscribedAnime
// ====================================================

export interface SubscribedAnime_subscribedEpisodes_episodes_links {
  __typename: "NyaaLinksType";
  magnet: string;
}

export interface SubscribedAnime_subscribedEpisodes_episodes {
  __typename: "NyaaItemType";
  name: string;
  fileSize: string;
  nbDownload: string;
  links: SubscribedAnime_subscribedEpisodes_episodes_links;
}

export interface SubscribedAnime_subscribedEpisodes {
  __typename: "SubscribedAnimeType";
  animeName: string;
  episodes: SubscribedAnime_subscribedEpisodes_episodes[];
}

export interface SubscribedAnime {
  subscribedEpisodes: SubscribedAnime_subscribedEpisodes[];
}
