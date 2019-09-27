import { createContext } from 'react';
import {
  onSubscriptionAdded,
  onSubscriptionAdded_subscriptions
} from './generated/onSubscriptionAdded';

interface IAppContext {
  subscriptions: onSubscriptionAdded_subscriptions[] | undefined;
  subscriptionsLoading: boolean;
  initialLoading: boolean;
}

export const AppContext = createContext<IAppContext>({
  subscriptions: undefined,
  subscriptionsLoading: false,
  initialLoading: false
});
