import React, { useEffect } from 'react';
import BaseLayout from './components/BaseLayout';
import SearchAnime from './components/SearchAnime';
import Downloads from './components/Downloads/index';
import { Route, Switch, HashRouter } from 'react-router-dom';
import { api } from './helpers/axiosInstance';
import gql from 'graphql-tag';
import { useSubscription, useQuery } from '@apollo/react-hooks';
import { onSubscriptionAdded } from './generated/onSubscriptionAdded';
import { AppContext } from './App.context';
import { onDownloadProgress } from './generated/onDownloadProgress';
import { querySubscriptions } from './generated/querySubscriptions';

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
  query querySubscriptions {
    subscribedEpisodes {
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

const SUBSCRIBE_DOWNLOAD_PROGRESS = gql`
  subscription onDownloadProgress {
    downloadProgress {
      animeName
      fileName
      progress
      downloadSpeed
    }
  }
`;

const App: React.FC = () => {
  useEffect(() => {
    api.get('rescanDownloads');
  }, []);

  /**
   * Anime subscriptions
   */
  const {
    data: subscriptionsData,
    loading: subscriptionsLoading
  } = useSubscription<onSubscriptionAdded>(SUBSCRIBE_ANIME_ADDED);

  const { loading: initialLoading, data: initialData } = useQuery<
    querySubscriptions
  >(QUERY_ANIME_SUBSCRIPTIONS);

  /**
   * Download progress
   */
  const { data: progressData } = useSubscription<onDownloadProgress>(
    SUBSCRIBE_DOWNLOAD_PROGRESS
  );

  const subs = subscriptionsData
    ? subscriptionsData.subscriptions
    : subscriptionsLoading && initialData
    ? initialData.subscribedEpisodes
    : [];

  console.log(subs);

  return (
    <AppContext.Provider
      value={{
        subscriptions: subs,
        initialLoading,
        downloadProgress: progressData ? progressData.downloadProgress : []
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
