import React from 'react';
import openSocket from 'socket.io-client';
import BaseLayout from './components/BaseLayout';
import SearchAnime from './components/SearchAnime';
import { SocketProvider } from './helpers/SocketProvider';
import Downloads from './components/Downloads/index';
import { Route, Switch, HashRouter } from 'react-router-dom';

const socket = openSocket('http://192.168.0.106:5001');
socket.on('connect', () => {
  console.log(`Successfully connected to port 5001`);
});

const App: React.FC = () => {
  console.log(`Wow just wow let's see what this puppy can do. Test`);
  return (
    <HashRouter>
      <SocketProvider value={{ socket }}>
        <BaseLayout>
          <Switch>
            <Route path="/" exact component={Downloads} />
            <Route path="/search" component={SearchAnime} />
          </Switch>
        </BaseLayout>
      </SocketProvider>
    </HashRouter>
  );
};

export default App;
