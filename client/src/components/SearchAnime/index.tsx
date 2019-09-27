import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios, { AxiosResponse } from 'axios';
import api from '../../helpers/axiosInstance';
import { Card, Input, Icon, Spin } from 'antd';
import useDebounce from '../../helpers/hooks/use-debounce';
import { JikanResult, JikanSearch } from '../../dto/jikan-search.dto';
import { SubscribeDto } from '../../dto/nyaa/subscribe.dto';
import { Loader } from '../Shared/Loader';

const { Search } = Input;
const { Meta } = Card;

const SearchAnime = () => {
  const [searchTerm, setSearchTerm] = useState('Kimetsu no yaiba');
  const [animeSearch, setAnimeSearch] = useState<JikanResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debounced = useDebounce(searchTerm, 1000);

  useEffect(() => {
    if (debounced) {
      setIsSearching(true);
      axios
        .get('https://api.jikan.moe/v3/search/anime', {
          params: {
            q: debounced,
            limit: 10
          }
        })
        .then((res: AxiosResponse<JikanSearch>) => {
          const animeResult: JikanResult[] = res.data.results;
          setAnimeSearch(animeResult);
          setIsSearching(false);
        });
    }
  }, [debounced]);

  return (
    <>
      <Search
        onChange={e => {
          setSearchTerm(e.target.value);
        }}
      />
      <Container>
        {searchTerm !== debounced || isSearching ? (
          <Loader />
        ) : (
          animeSearch.map((anime: JikanResult) => {
            const img = <img src={anime.image_url} alt={anime.image_url} />;
            return (
              <Card
                key={anime.mal_id}
                style={{ width: 240 }}
                cover={img}
                actions={[
                  <Icon
                    type="save"
                    key="save"
                    onClick={() => {
                      /**
                       * TODO: Need to have a verify if anime exists in nyaa
                       */
                      console.log('Save anime');
                      const data: SubscribeDto = { animeName: anime.title };
                      api.post('/nyaa/subscribe', data).then(() => {
                        console.log('Added to subscriptions');
                      });
                    }}
                  />
                ]}
              >
                <Meta title={anime.title} description={anime.score} />
              </Card>
            );
          })
        )}
      </Container>
    </>
  );
};

const Container = styled.div`
  margin-top: 24px;
  display: flex;
  flex-wrap: wrap;

  > * {
    margin-left: 10px;
    margin-bottom: 10px;
  }

  .ant-card-cover {
    text-align: center;
    height: 300px;
    overflow: hidden;
    img {
      height: 100%;
      width: auto;
      display: inline-block;
      margin-left: -1000px;
      margin-right: -1000px;
    }
  }
`;

export default SearchAnime;
