import React, { useContext } from 'react';
import { List, Typography, Progress, Button } from 'antd';
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
  const [startDownload, { loading }] = useMutation<StartDownload_startDownload>(
    START_DOWNLOAD
  );

  const matchingProgress =
    downloadProgress &&
    downloadProgress.find(progress => progress.fileName === name);
  const progressWheel = matchingProgress ? (
    <Progress percent={matchingProgress.progress} width={50} />
  ) : null;
  const isDone = matchingProgress && matchingProgress.progress === 100;

  console.log(downloadProgress);

  const actions = [];
  if (isDone) {
    actions.push(
      <Button
        onClick={() =>
          // TODO: Static code for now
          fetch('http://192.168.0.105:5000/openDownloadsDirectory')
        }
        icon="folder-open"
        type="primary"
        size="small"
      >
        Open folder
      </Button>
    );
  } else {
    actions.push(
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
        {matchingProgress ? matchingProgress.status : 'Download'}
      </Button>
    );
  }

  if (progressWheel) {
    actions.push(<div style={{ width: 201 }}>{progressWheel}</div>);
  }
  if (matchingProgress && matchingProgress.progress !== 100) {
    actions.push(<Text>{`${matchingProgress.downloadSpeed} kb/s`}</Text>);
  }

  return (
    <Item key={name} actions={actions}>
      <Item.Meta title={name} />
    </Item>
  );
};

export default ListItem;
