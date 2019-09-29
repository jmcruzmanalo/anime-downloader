import { createContext } from 'react';
import {
  onSubscriptionAdded_subscriptions
} from './generated/onSubscriptionAdded';
import { onDownloadProgress_downloadProgress } from './generated/onDownloadProgress';
import { querySubscriptions_subscribedEpisodes } from './generated/querySubscriptions';

interface IAppContext {
  subscriptions:
    | onSubscriptionAdded_subscriptions[]
    | querySubscriptions_subscribedEpisodes[]
    | undefined;
  initialLoading: boolean;
  downloadProgress: onDownloadProgress_downloadProgress[] | undefined;
}

export const AppContext = createContext<IAppContext>({
  subscriptions: undefined,
  initialLoading: false,
  downloadProgress: undefined
});
