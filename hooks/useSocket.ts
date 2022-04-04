import axios from 'axios';
import { useCallback } from 'react';
import io from 'socket.io-client'; 

const baseUrl = 'http://localhost:3095';

const sockets: { [key: string]: SocketIOClient.Socket } = {};

const useSocket = (workspace?: string): [SocketIOClient.Socket | undefined, () => void] => { 
  const disconnect = useCallback(() => {
    if (workspace) {
      sockets[workspace].disconnect();
      delete sockets[workspace];
    }    
  }, [workspace]);

  if (!workspace) return [ undefined, disconnect ];

  if (!sockets[workspace]) {
    sockets[workspace] = io.connect(`${baseUrl}/ws-${workspace}`, { 
      /* 
      polling: websocket임에도 http로 요청을 보냄. http로 보낸 뒤 나중에 websocket으로 변환하는 게 socket.io 
      socket.io가 구ie 같은 경우 웹 소켓이 브라우저에 없는 경우 존재. -> 먼저 http로 요청 후 지원을 하는 서버이거나 브라우저인게 확인이 되면 웹소켓으로 올린다.
      */
      transports: [ 'websocket' ]   
    });    
  }
  
  return [ sockets[workspace], disconnect ]
};

export default useSocket; 