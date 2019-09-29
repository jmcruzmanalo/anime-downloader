import React from 'react';
import gql from 'graphql-tag';
import { Tabs, Badge, Button } from 'antd';
import { AllDownloads } from './AllDownloads';
import { useQuery } from '@apollo/react-hooks';
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
  useQuery<initialDownloadProgress>(QUERY_DOWNLOAD_PROGRESS);

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
              <Button type="link" className="head-example">
                All
              </Button>
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
