import React, { useContext, useState } from 'react';
import { JikanResult } from '../../dto/jikan-search.dto';
import { AppContext } from '../../App.context';
import { Icon, Card } from 'antd';
import { SubscribeDto } from '../../dto/nyaa/subscribe.dto';
import api from '../../helpers/axiosInstance';
import Meta from 'antd/lib/card/Meta';

interface ISearchResultCard {
  anime: JikanResult;
}

const SearchResultCard: React.FC<ISearchResultCard> = ({ anime }) => {
  const [isSaving, setIsSaving] = useState(false);
  const { subscriptions } = useContext(AppContext);

  const isSubscribed =
    subscriptions &&
    subscriptions.find(sub => {
      return sub.animeName.toLowerCase() === anime.title.toLowerCase();
    });

  let icon = [];
  if (isSaving) {
    icon.push(<Icon type="loading" />);
  } else if (isSubscribed) {
    icon.push(
      <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />
    );
  } else {
    icon.push(
      <Icon
        type="save"
        key="save"
        theme="twoTone"
        onClick={() => {
          setIsSaving(true);
          const data: SubscribeDto = { animeName: anime.title };
          api.post('/nyaa/subscribe', data).then(() => {
            setIsSaving(false);
          });
        }}
      />
    );
  }

  const img = <img src={anime.image_url} alt={anime.image_url} />;
  return (
    <Card style={{ width: 240 }} cover={img} actions={icon}>
      <Meta title={anime.title} description={anime.score} />
    </Card>
  );
};

export default SearchResultCard;
