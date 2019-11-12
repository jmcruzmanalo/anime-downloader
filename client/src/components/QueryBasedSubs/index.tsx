import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Input, Row, Col, Select, Button } from 'antd';
import gql from 'graphql-tag';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import {
  searchNyaaQuery,
  searchNyaaQueryVariables
} from '../../generated/searchNyaaQuery';
import { RESOLUTION } from '../../generated/globalTypes';
import useDebounce from '../../helpers/hooks/use-debounce';
import { Loader } from '../Shared/Loader';
import {
  subscribeToSearchQuery,
  subscribeToSearchQueryVariables
} from '../../generated/subscribeToSearchQuery';

const { Search } = Input;
const { Option } = Select;

const SEARCH_NYAA = gql`
  query searchNyaaQuery($searchQuery: String!, $resolution: RESOLUTION!) {
    searchNyaa(searchQuery: $searchQuery, resolution: $resolution) {
      name
      fileSize
      links {
        magnet
      }
      timestamp
    }
  }
`;

const SUBSCRIBE_TO_SEARCH_QUERY = gql`
  mutation subscribeToSearchQuery(
    $searchQuery: String!
    $resolution: RESOLUTION!
  ) {
    subscribeToSearchQuery(searchQuery: $searchQuery, resolution: $resolution)
  }
`;

export const QueryBasedSubs = () => {
  const [loadQuery, { data, loading }] = useLazyQuery<
    searchNyaaQuery,
    searchNyaaQueryVariables
  >(SEARCH_NYAA);
  const [subscribe, { loading: isSubscribing }] = useMutation<
    subscribeToSearchQuery,
    subscribeToSearchQueryVariables
  >(SUBSCRIBE_TO_SEARCH_QUERY);
  const [searchQuery, setSearchQuery] = useState('');
  const [resolution, setResolution] = useState<RESOLUTION>(RESOLUTION.FULL_HD);
  const debounced = useDebounce(searchQuery, 1000);

  useEffect(() => {
    if (debounced && resolution) {
      loadQuery({
        variables: {
          searchQuery: debounced,
          resolution: resolution
        }
      });
    }
  }, [debounced, resolution]);

  return (
    <>
      <StyledRow>
        <StyledCol span={12}>
          <Search
            placeholder="Ex. Kimetsu no yaiba"
            onChange={e => setSearchQuery(e.target.value)}
          />
        </StyledCol>
        <StyledCol span={8}>
          <Select<RESOLUTION>
            onChange={value => setResolution(value)}
            value={resolution}
            defaultValue={RESOLUTION.FULL_HD}
            style={{ width: '100%' }}
          >
            <Option value={RESOLUTION.FULL_HD}>1080p</Option>
            <Option value={RESOLUTION.HD}>720p</Option>
            <Option value={RESOLUTION.TRASH_QUALITY}>480p trash</Option>
          </Select>
        </StyledCol>
        <StyledCol span={4}>
          <Button
            loading={isSubscribing}
            type="primary"
            onClick={() => {
              subscribe({
                variables: {
                  searchQuery,
                  resolution
                }
              });
            }}
          >
            Save search query
          </Button>
        </StyledCol>
      </StyledRow>
      {searchQuery !== debounced || loading ? (
        <Loader />
      ) : (
        <ul>
          {data &&
            data.searchNyaa.map(ep => {
              return <li key={ep.name}>{ep.name}</li>;
            })}
        </ul>
      )}
    </>
  );
};

const StyledCol = styled(Col)``;

const StyledRow = styled(Row)`
  ${StyledCol} {
    padding: 0 12px;
  }
`;
