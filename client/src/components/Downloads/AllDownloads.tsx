import React, { useEffect } from 'react';
import { Tabs, Empty, List, Typography, Button, Progress } from 'antd';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { SubscribedAnime } from '../../generated/SubscribedAnime';
import { Loader } from '../Shared/Loader';
import { GetDownloadProgress_downloadProgress } from '../../generated/GetDownloadProgress';
import { NyaaItemInput } from '../../generated/globalTypes';
import Scroll from 'react-perfect-scrollbar';
import { StartDownload_startDownload } from '../../generated/StartDownload';

const { TabPane } = Tabs;
const { Item } = List;
const { Text } = Typography;

interface IAllDownloads {
  downloadProgress: GetDownloadProgress_downloadProgress[];
}

const SUBSCRIBED_ANIME = gql`
  query SubscribedAnime {
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

const START_DOWNLOAD = gql`
  mutation StartDownload($nyaaItem: NyaaItemInput!) {
    startDownload(nyaaItem: $nyaaItem) {
      name
    }
  }
`;

export const AllDownloads: React.FC<IAllDownloads> = ({ downloadProgress }) => {
  const { data, loading, refetch } = useQuery<SubscribedAnime>(
    SUBSCRIBED_ANIME
  );
  const [startDownload, { data: startedDownload }] = useMutation<
    StartDownload_startDownload
  >(START_DOWNLOAD);

  if (loading) return <Loader />;

  if ((!data || data.subscribedEpisodes.length === 0) && !loading) {
    if (refetch) refetch();
    return (
      <Empty
        description={
          <span>Nani the fuck? You no subscribe to yameteh oni chan.</span>
        }
      />
    );
  }

  let animeOutput =
    data &&
    data.subscribedEpisodes.map(({ animeName, episodes }) => {
      return (
        <TabPane key={animeName} tab={animeName}>
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
                              'http://localhost:5000/openDownloadsDirectory'
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
                              },
                              nbDownload: ep.nbDownload
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
                    <Item.Meta title={ep.name} description="hello" />
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
