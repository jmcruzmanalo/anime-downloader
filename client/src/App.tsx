import React, { useEffect } from 'react';
import BaseLayout from './components/BaseLayout';
import SearchAnime from './components/SearchAnime';
import Downloads from './components/Downloads/index';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import { api } from './helpers/axiosInstance';
import gql from 'graphql-tag';
import { useSubscription, useQuery } from '@apollo/react-hooks';
import { onSubscriptionAdded } from './generated/onSubscriptionAdded';
import { AppContext } from './App.context';
import { onDownloadProgress } from './generated/onDownloadProgress';
import { querySubscriptions } from './generated/querySubscriptions';
import { QueryBasedSubs } from './components/QueryBasedSubs';

const SUBSCRIBE_ANIME_ADDED = gql`
  subscription onSubscriptionAdded {
    subscriptions {
      animeName
      resolution
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
      resolution
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
      status
    }
  }
`;

const App: React.FC = () => {
  useEffect(() => {
    api.get('rescanDownloads');
  }, []);

  /**
   * Server state
   */

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

  return (
    <AppContext.Provider
      value={{
        subscriptions: subs,
        initialLoading,
        downloadProgress: progressData ? progressData.downloadProgress : []
      }}
    >
      <BrowserRouter>
        <BaseLayout>
          <Switch>
            <Route path="/" exact component={Downloads} />
            <Route path="/search" component={SearchAnime} />
            <Route path="/queryBasedSubs" component={QueryBasedSubs} />
          </Switch>
        </BaseLayout>
      </BrowserRouter>
    </AppContext.Provider>
  );
};

export default App;
