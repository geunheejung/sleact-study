import React, { useCallback, useEffect, useRef } from 'react';
import gravatar from 'gravatar'
import { Container, Header } from '@pages/DirectMessage/styles';
import useSWR, { mutate } from 'swr';
import useSWRInfinite from 'swr/infinite'
import fetcher from '@utils/fetcher';
import { IDM, IUser } from '@typings/db';
import { useParams } from 'react-router-dom';
import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useInput';
import axios from 'axios';
import makeSection from '@utils/makeSection';
import Scrollbars from 'react-custom-scrollbars';
import getMockChatData from '@utils/getChatMockData';
import useSocket from '@hooks/useSocket';

const DirectMessage = () => {
  const { workspaceName, dmId } = useParams<{workspaceName: string, dmId: string}>(); 
  
  const scrollBarRef = useRef<Scrollbars>(null);

  const [ chat, onChangeChat, setChat ] = useInput('');
  
  const { data: userData } = useSWR<IUser>(
    `/api/workspaces/${workspaceName}/users/${dmId}`,
    fetcher
  );
  const { data: myData, mutate: userMutate } = useSWR<IUser>(
    '/api/users', 
    fetcher
  );

  const PAGE_SIZE = 20;
  
  const { data: chatData, mutate: mutateChat, setSize } = useSWRInfinite<IDM[]>(
    (pageIndex: number) => {
      const base = `/api/workspaces/${workspaceName}/dms/${dmId}/chats`;
      const perPage = `perPage=${PAGE_SIZE}`;
      const page = `page=${pageIndex + 1}`;
  
      return `${base}?${perPage}&${page}`;
    }, 
    fetcher
  ); 
  
  const [socket] = useSocket(workspaceName);

  const onMessage = useCallback((data: IDM) => {    
    // id는 상대방 아이디
    if (data.SenderId === Number(dmId) && myData?.id !== Number(dmId)) {
      mutateChat((_chatData) => {
        _chatData?.[0].unshift(data);
        return _chatData;
      }, false).then(() => {
        if (scrollBarRef.current) {
          if (  
            scrollBarRef.current.getScrollHeight() < 
            scrollBarRef.current.getClientHeight() + scrollBarRef.current.getScrollTop() + 150
          ) {
            scrollBarRef.current.scrollToBottom();
          }
        }        
      })      
    }
  }, []);

  useEffect(() => {
    if (chatData?.length === 1) {
      scrollToBottom();
    } 
  }, [chatData, ])

  useEffect(() => {
    socket?.on('dm', onMessage);
  
    return () => {
      socket?.off('dm', onMessage);
    }
  }, [socket, dmId, myData])
  


  const scrollToBottom = () => { scrollBarRef.current?.scrollToBottom(); };

  const isChatData = Array.isArray(chatData);
  const isEmpty = chatData?.[0]?.length === 0; 
  const isReachingEnd = isEmpty || !!(isChatData && chatData[chatData.length - 1]?.length < PAGE_SIZE);

  const optimistic = () => {
    const savedChat = chat;
    mutateChat((prevChatData) => {
      if (userData && myData) prevChatData?.[0].unshift(getMockChatData(chat, userData, myData));      
      return prevChatData;     
    }, false)
      .then(() => {
        scrollToBottom();    
      });
  };

  const onSubmitForm = useCallback((e) => {
    e.preventDefault();     
    optimistic();
    
    axios.post(`/api/workspaces/${workspaceName}/dms/${dmId}/chats`, {
      content: chat,
    })
    .then(() => {
      mutateChat();
      setChat('');   
    })
    .catch(err => {
      console.log(err);
    });

  }, [chat, chatData, myData, userData, workspaceName, dmId]);

  const chatSections = makeSection(isChatData ? chatData.flat().reverse() : []);

  if (!userData || !myData) return null;

  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData.email, { s: '24px', d: 'retro' })} alt={userData.nickname} />  
      </Header>        
      {isChatData && <ChatList 
      ref={scrollBarRef} 
      chatSections={chatSections} 
      setSize={setSize} 
      isEmpty={isEmpty}
      isReachingEnd={isReachingEnd}
      />}
      <ChatBox 
        chat={chat}         
        onChangeChat={onChangeChat}
        onSubmitForm={onSubmitForm}
      />
    </Container>
  )
}

export default DirectMessage;