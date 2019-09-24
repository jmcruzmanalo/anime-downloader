import React from 'react';
import openSocket from 'socket.io-client';
import BaseLayout from './components/BaseLayout';
import SearchAnime from './components/SearchAnime';
import Downloads from './components/Downloads/index';
import { Route, Switch, HashRouter } from 'react-router-dom';

const App: React.FC = () => {
  console.log(`Wow just wow let's see what this puppy can do. Test`);
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

