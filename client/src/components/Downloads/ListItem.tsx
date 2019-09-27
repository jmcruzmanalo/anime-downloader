import React, { useContext } from 'react';
import styled from 'styled-components';
import { List, Typography, Progress, Button } from 'antd';
import { DownloadProgressDto } from '../../dto/torrent/download-progress.dto';
import { GetDownloadProgress_downloadProgress } from '../../generated/GetDownloadProgress';
import { AppContext } from '../../App.context';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { StartDownload_startDownload } from '../../generated/StartDownload';
import { onSubscriptionAdded_subscriptions_episodes } from '../../generated/onSubscriptionAdded';
import { NyaaItemInput } from '../../generated/globalTypes';

const { Item } = List;
const { Text } = Typography;

interface IListItem {
  episode: onSubscriptionAdded_subscriptions_episodes;
}

/**
 * TODO: rename mutation name (StartDownload) to startDownload
 */

const START_DOWNLOAD = gql`
  mutation StartDownload($nyaaItem: NyaaItemInput!) {
    startDownload(nyaaItem: $nyaaItem) {
      name
    }
  }
`;

const ListItem: React.FC<IListItem> = ({ episode }) => {
  const { name, fileSize, links } = episode;
  const { downloadProgress } = useContext(AppContext);
  const [startDownload, { loading }] = useMutation<
    StartDownload_startDownload
  >(START_DOWNLOAD);

  const matchingProgress =
    downloadProgress &&
    downloadProgress.find(progress => progress.fileName === name);
  const progressWheel = matchingProgress ? (
    <Progress percent={matchingProgress.progress} width={50} />
  ) : null;
  const isDone = matchingProgress && matchingProgress.progress === 100;
  return (
    <Item
      key={name}
      actions={[
        isDone ? (
          <Button
            onClick={() =>
              // TODO: Static code for now
              fetch('http://192.168.0.104:5000/openDownloadsDirectory')
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
                name: name,
                fileSize: fileSize,
                links: {
                  magnet: links.magnet
                }
              };
              startDownload({
                variables: {
                  nyaaItem: item
                }
              });
            }}
            loading={!!matchingProgress || loading}
            type="primary"
            icon="download"
            size="small"
          >
            {matchingProgress ? 'Downloading' : 'Download'}
          </Button>
        ),
        progressWheel && <div style={{ width: 201 }}>{progressWheel}</div>,
        matchingProgress && matchingProgress.progress !== 100 && (
          <Text>{`${matchingProgress.downloadSpeed} kb/s`}</Text>
        )
      ]}
    >
      <Item.Meta title={name} />
    </Item>
  );
};

export default ListItem;
