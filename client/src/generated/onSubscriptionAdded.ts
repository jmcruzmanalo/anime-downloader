/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: onSubscriptionAdded
// ====================================================

export interface onSubscriptionAdded_subscriptions_episodes_links {
  __typename: "NyaaLinksType";
  magnet: string;
}

export interface onSubscriptionAdded_subscriptions_episodes {
  __typename: "NyaaItemType";
  name: string;
  fileSize: string;
  nbDownload: string;
  links: onSubscriptionAdded_subscriptions_episodes_links;
}

export interface onSubscriptionAdded_subscriptions {
  __typename: "SubscribedAnimeType";
  animeName: string;
  episodes: onSubscriptionAdded_subscriptions_episodes[];
}

export interface onSubscriptionAdded {
  subscriptions: onSubscriptionAdded_subscriptions[];
}
