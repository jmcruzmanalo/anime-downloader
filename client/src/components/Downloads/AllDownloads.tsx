import React, { useEffect, useContext } from 'react';
import { Tabs, Empty, List, Typography, Button, Progress } from 'antd';
import gql from 'graphql-tag';
import { useMutation, useSubscription, useQuery } from '@apollo/react-hooks';
import { NyaaItemInput } from '../../generated/globalTypes';
import Scroll from 'react-perfect-scrollbar';
import { StartDownload_startDownload } from '../../generated/StartDownload';
import { onSubscriptionAdded } from '../../generated/onSubscriptionAdded';
import { onDownloadProgress_downloadProgress } from '../../generated/onDownloadProgress';
import {
  subscriptions,
  subscriptions_subscribedEpisodes
} from '../../generated/subscriptions';
import { Loader } from '../Shared/Loader';
import { AppContext } from '../../App.context';

const { TabPane } = Tabs;
const { Item } = List;
const { Text } = Typography;

interface IAllDownloads {
  downloadProgress: onDownloadProgress_downloadProgress[];
}

const START_DOWNLOAD = gql`
  mutation StartDownload($nyaaItem: NyaaItemInput!) {
    startDownload(nyaaItem: $nyaaItem) {
      name
    }
  }
`;

export const AllDownloads: React.FC<IAllDownloads> = ({ downloadProgress }) => {
  const { subscriptions, subscriptionsLoading, initialLoading } = useContext(AppContext);

  const [startDownload, { data: startedDownload }] = useMutation<
    StartDownload_startDownload
  >(START_DOWNLOAD);

  if (initialLoading || subscriptionsLoading) return <Loader />;

  if (
    (!subscriptions || subscriptions.length === 0) &&
    (!initialLoading || !subscriptionsLoading)
  ) {
    return (
      <Empty
        description={
          <span>
            Nani the fuck? You no subscribe to anything. That is not daijobu.
          </span>
        }
      />
    );
  }

  let animeOutput =
    subscriptions &&
    subscriptions.map(({ animeName, episodes }) => {
      return (
        <TabPane
          key={animeName}
          tab={<span style={{ fontWeight: 'normal' }}>{animeName}</span>}
        >
          <Scroll style={{ height: `calc(100vh - 292px)` }}>
            <List
              itemLayout="vertical"
              style={{ height: `100%`, overflow: 'visible' }}
            >
              {episodes.map(ep => {
                const matchingProgress = downloadProgress.find(
                  progress => progress.fileName === ep.name
                );
                const progressWheel = matchingProgress ? (
                  <Progress percent={matchingProgress.progress} width={50} />
                ) : null;
                const isDone =
                  matchingProgress && matchingProgress.progress === 100;
                const isLoading =
                  !!startedDownload && startedDownload.name === ep.name;
                return (
                  <Item
                    key={ep.name}
                    actions={[
                      isDone ? (
                        <Button
                          onClick={() =>
                            // TODO: Static code for now
                            fetch(
                              'http://192.168.0.104:5000/openDownloadsDirectory'
                            )
                          }
                          icon="folder-open"
                          type="primary"
                          size="small"
                        >
                          Open folder
                        </Button>
                      ) : (
                        <Button
                          onClick={() => {
                            const item: NyaaItemInput = {
                              name: ep.name,
                              fileSize: ep.fileSize,
                              links: {
                                magnet: ep.links.magnet
                              }
                            };
                            startDownload({
                              variables: {
                                nyaaItem: item
                              }
                            });
                          }}
                          loading={!!matchingProgress || isLoading}
                          type="primary"
                          icon="download"
                          size="small"
                        >
                          {matchingProgress ? 'Downloading' : 'Download'}
                        </Button>
                      ),
                      progressWheel && (
                        <div style={{ width: 201 }}>{progressWheel}</div>
                      ),
                      matchingProgress && matchingProgress.progress !== 100 && (
                        <Text>{`${matchingProgress.downloadSpeed} kb/s`}</Text>
                      )
                    ]}
                  >
                    <Item.Meta title={ep.name} />
                  </Item>
                );
              })}
            </List>
          </Scroll>
        </TabPane>
      );
    });

  return (
    <Tabs
      defaultActiveKey="1"
      tabPosition="left"
      style={{ height: `calc(100vh - 292px)`, overflow: 'auto' }}
    >
      {animeOutput}
    </Tabs>
  );
};
