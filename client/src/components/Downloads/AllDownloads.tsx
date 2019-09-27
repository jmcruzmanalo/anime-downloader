import React, { useContext } from 'react';
import { Tabs, Empty, List } from 'antd';
import Scroll from 'react-perfect-scrollbar';
import { onSubscriptionAdded_subscriptions_episodes } from '../../generated/onSubscriptionAdded';
import { Loader } from '../Shared/Loader';
import { AppContext } from '../../App.context';
import ListItem from './ListItem';

const { TabPane } = Tabs;

export const AllDownloads: React.FC = () => {
  const { subscriptions, subscriptionsLoading, initialLoading } = useContext(
    AppContext
  );

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
              {episodes.map(
                (ep: onSubscriptionAdded_subscriptions_episodes) => {
                  return <ListItem key={ep.name} episode={ep} />;
                }
              )}
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
