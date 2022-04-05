import React, { useCallback } from 'react';
import gravatar from 'gravatar'
import { Header } from '@pages/DirectMessage/styles';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import { IDM, IUser } from '@typings/db';
import { useParams } from 'react-router-dom';
import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useInput';
import axios from 'axios';

const DirectMessage = () => {
  const { workspaceName, dmId } = useParams<{workspaceName: string, dmId: string}>(); 
  
  const { data: userData } = useSWR(
    `/api/workspaces/${workspaceName}/users/${dmId}`,
    fetcher
  )
  const { data: myData, mutate: userMutate } = useSWR<IUser>(
    '/api/users', 
    fetcher
  );

  const PAGE_SIZE = 20;

  const { data: chatData, mutate: mutateChat } = useSWR<IDM[]>(
    `/api/workspaces/${workspaceName}/dms/${dmId}/chats?perPage=${PAGE_SIZE}&page=${1}`, 
    fetcher
  );  
  
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

  console.log(chatData, 'chatData');
  

  if (!userData || !myData) return null;

  return (
    <div>
      <Header>
        <img src={gravatar.url(userData.email, { s: '24px', d: 'retro' })} alt={userData.nickname} />  
      </Header>        
      {Array.isArray(chatData) && <ChatList 
        chatData={chatData}
      />}
      <ChatBox 
        chat={chat}         
        onChangeChat={onChangeChat}
        onSubmitForm={onSubmitForm}
      />
    </div>
  )
}

export default DirectMessage;