import React, { useCallback, useRef } from 'react';
import gravatar from 'gravatar'
import { Container, Header } from '@pages/DirectMessage/styles';
import useSWR from 'swr';
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

const DirectMessage = () => {
  const { workspaceName, dmId } = useParams<{workspaceName: string, dmId: string}>(); 
  
  const scrollBarRef = useRef<Scrollbars>(null);
  
  const { data: userData } = useSWR(
    `/api/workspaces/${workspaceName}/users/${dmId}`,
    fetcher
  )
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

  const isChatData = Array.isArray(chatData);
  const isEmpty = chatData?.[0]?.length === 0; 
  const isReachingEnd = isEmpty || !!(isChatData && chatData[chatData.length - 1]?.length < PAGE_SIZE);
  
  const [ chat, onChangeChat, setChat ] = useInput('');

  const onSubmitForm = useCallback((e) => {
    e.preventDefault();     
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

  }, [chat]);

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