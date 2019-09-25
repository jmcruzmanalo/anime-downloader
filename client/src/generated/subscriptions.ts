/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: subscriptions
// ====================================================

export interface subscriptions_subscribedEpisodes {
  __typename: "SubscribedAnimeType";
  animeName: string;
}

export interface subscriptions {
  subscribedEpisodes: subscriptions_subscribedEpisodes[];
}
