import { createContext } from 'react';
import {
  onSubscriptionAdded,
  onSubscriptionAdded_subscriptions
} from './generated/onSubscriptionAdded';
import { onDownloadProgress_downloadProgress } from './generated/onDownloadProgress';

interface IAppContext {
  subscriptions: onSubscriptionAdded_subscriptions[] | undefined;
  subscriptionsLoading: boolean;
  initialLoading: boolean;
  downloadProgress: onDownloadProgress_downloadProgress[] | undefined;
}

export const AppContext = createContext<IAppContext>({
  subscriptions: undefined,
  subscriptionsLoading: false,
  initialLoading: false,
  downloadProgress: undefined
});
