/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: onSubscriptionAdded
// ====================================================

export interface onSubscriptionAdded_subscriptionAdded_episodes_links {
  __typename: "NyaaLinksType";
  magnet: string;
}

export interface onSubscriptionAdded_subscriptionAdded_episodes {
  __typename: "NyaaItemType";
  name: string;
  fileSize: string;
  nbDownload: string;
  links: onSubscriptionAdded_subscriptionAdded_episodes_links;
}

export interface onSubscriptionAdded_subscriptionAdded {
  __typename: "SubscribedAnimeType";
  animeName: string;
  episodes: onSubscriptionAdded_subscriptionAdded_episodes[];
}

export interface onSubscriptionAdded {
  subscriptionAdded: onSubscriptionAdded_subscriptionAdded[];
}
