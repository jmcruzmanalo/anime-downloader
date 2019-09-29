import React, { useContext } from 'react';
import { Tabs, Empty, List, PageHeader, Button, Icon } from 'antd';
import styled from 'styled-components';
import { onSubscriptionAdded_subscriptions_episodes } from '../../generated/onSubscriptionAdded';
import { Loader } from '../Shared/Loader';
import { AppContext } from '../../App.context';
import ListItem from './ListItem';
import api from '../../helpers/axiosInstance';

const { TabPane } = Tabs;

export const AllDownloads: React.FC = () => {
  const { subscriptions, initialLoading } = useContext(AppContext);

  if (initialLoading) return <Loader />;

  if ((!subscriptions || subscriptions.length === 0) && !initialLoading) {
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
          <TabHeader
            title={animeName.toUpperCase()}
            extra={[
              <Button key="refresh" type="primary">
                <Icon type="reload" />
              </Button>,
              <Button
                key="delete"
                type="danger"
                onClick={() => {
                  api.delete('/nyaa/unsubscribe', {
                    data: {
                      animeName
                    }
                  });
                }}
              >
                <Icon type="delete" theme="filled" />
              </Button>
            ]}
          ></TabHeader>
          <div style={{ height: `calc(100vh - 351px)`, overflow: 'auto' }}>
            <List
              itemLayout="vertical"
              style={{ height: `100%`, overflow: 'visible' }}
            >
              {episodes.map(
                (ep: onSubscriptionAdded_subscriptions_episodes) => {
                  return <ListItem key={ep.name} episode={ep} />;
                }
              )}
            </List>
          </div>
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

const TabHeader = styled(PageHeader)`
  padding: 0;
  height: 50px;
  border-bottom: 1px solid #eee;
`;
