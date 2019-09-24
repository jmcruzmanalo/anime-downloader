import React, { useContext, useState, useCallback, useEffect } from 'react';
import SocketContext from '../../helpers/SocketProvider';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Tabs, Badge } from 'antd';
import {
  GetDownloadProgress_downloadProgress,
  GetDownloadProgress
} from '../../generated/GetDownloadProgress';
import { AllDownloads } from './AllDownloads';

/**
 * TODO:
 * src/generated/globalTypes.ts is being excluded for now
 * until needed.
 */

const { TabPane } = Tabs;

const query = gql`
  query GetDownloadProgress {
    downloadProgress {
      fileName
      animeName
      downloadSpeed
      progress
    }
  }
`;

const Downloads = () => {
  const [downloads, setDownloads] = useState<
    GetDownloadProgress_downloadProgress[]
  >([]);

  // const { data, refetch } = useQuery<GetDownloadProgress>(query);

  // useEffect(() => {
  //   if (data) {
  //     setDownloads(data.downloadProgress);
  //   }
  // }, [data]);

  // useEffect(() => {
  //   if (socket) {
  //     socket.on('downloadUpdate', downloadUpdate);
  //   }
  // }, [socket, downloadUpdate]);

  return (
    <Tabs
      defaultActiveKey="1"
      style={{
        height: `calc(100vh - 233px)`
      }}
    >
      <TabPane
        tab={
          <div>
            <Badge count={0} offset={[20, 0]}>
              <a className="head-example">All</a>
            </Badge>
          </div>
        }
        key="1"
      >
        <AllDownloads downloadProgress={downloads} />
      </TabPane>
    </Tabs>
  );
};

export default Downloads;
