import React from 'react';
import styled from 'styled-components';
import { Spin } from 'antd';

export const Loader = () => {
  return (
    <Container>
      <Spin size="large" />
    </Container>
  );
};

const Container = styled.div`
  padding: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
