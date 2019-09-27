import React from 'react';
import gql from 'graphql-tag';
import { Tabs, Badge } from 'antd';
import { AllDownloads } from './AllDownloads';
import { useSubscription, useQuery } from '@apollo/react-hooks';
import { onDownloadProgress } from '../../generated/onDownloadProgress';
import { initialDownloadProgress } from '../../generated/initialDownloadProgress';

const { TabPane } = Tabs;

const QUERY_DOWNLOAD_PROGRESS = gql`
  query initialDownloadProgress {
    getDownloadProgress {
      fileName
    }
  }
`;

const Downloads = () => {
  const { loading: initialLoading } = useQuery<initialDownloadProgress>(
    QUERY_DOWNLOAD_PROGRESS
  );

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
        <AllDownloads />
      </TabPane>
    </Tabs>
  );
};

export default Downloads;
