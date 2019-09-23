import { createContext } from 'react';

type SocketContextType = {
  socket?: SocketIOClient.Socket;
};

const SocketContext = createContext<SocketContextType>({});

export const SocketProvider = SocketContext.Provider;
export const SocketConsumer = SocketContext.Consumer;

export default SocketContext;
