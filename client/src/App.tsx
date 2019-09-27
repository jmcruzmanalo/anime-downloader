import React from 'react';
import BaseLayout from './components/BaseLayout';
import SearchAnime from './components/SearchAnime';
import Downloads from './components/Downloads/index';
import { Route, Switch, HashRouter } from 'react-router-dom';
import { api } from './helpers/axiosInstance';

const App: React.FC = () => {
  api.get('rescanDownloads');
  return (
    <HashRouter>
      <BaseLayout>
        <Switch>
          <Route path="/" exact component={Downloads} />
          <Route path="/search" component={SearchAnime} />
        </Switch>
      </BaseLayout>
    </HashRouter>
  );
};

export default App;
