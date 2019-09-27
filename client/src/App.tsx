import React from 'react';
import BaseLayout from './components/BaseLayout';
import SearchAnime from './components/SearchAnime';
import Downloads from './components/Downloads/index';
import { Route, Switch, HashRouter } from 'react-router-dom';
import { api } from './helpers/axiosInstance';
import gql from 'graphql-tag';
import { useSubscription, useQuery } from '@apollo/react-hooks';
import { onSubscriptionAdded } from './generated/onSubscriptionAdded';
import { AppContext } from './App.context';
import { subscriptions } from './generated/subscriptions';

const SUBSCRIBE_ANIME_ADDED = gql`
  subscription onSubscriptionAdded {
    subscriptions {
      animeName
      episodes {
        name
        fileSize
        nbDownload
        links {
          magnet
        }
      }
    }
  }
`;

const QUERY_ANIME_SUBSCRIPTIONS = gql`
  query subscriptions {
    subscribedEpisodes {
      animeName
    }
  }
`;


const App: React.FC = () => {
  api.get('rescanDownloads');

  const {
    data: subscriptionsData,
    loading: subscriptionsLoading
  } = useSubscription<onSubscriptionAdded>(SUBSCRIBE_ANIME_ADDED);

  const { loading: initialLoading } = useQuery<subscriptions>(
    QUERY_ANIME_SUBSCRIPTIONS
  );

  return (
    <AppContext.Provider
      value={{
        subscriptions: subscriptionsData ? subscriptionsData.subscriptions : [],
        subscriptionsLoading,
        initialLoading
      }}
    >
      <HashRouter>
        <BaseLayout>
          <Switch>
            <Route path="/" exact component={Downloads} />
            <Route path="/search" component={SearchAnime} />
          </Switch>
        </BaseLayout>
      </HashRouter>
    </AppContext.Provider>
  );
};

export default App;
