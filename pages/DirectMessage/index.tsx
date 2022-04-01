import React from 'react';
import gravatar from 'gravatar'
import { Header } from '@pages/DirectMessage/styles';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import { IUser } from '@typings/db';
import { useParams } from 'react-router-dom';
import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';

const DirectMessage = () => {
  const { workspaceName, dmId } = useParams<{workspaceName: string, dmId: string}>(); 
  console.log(dmId)
  const { data: userData } = useSWR(
    `/api/workspaces/${workspaceName}/users/${dmId}`,
    fetcher
  )
  const { data: myData, mutate: userMutate } = useSWR<IUser>(
    '/api/users', 
    fetcher
  );

  if (!userData || !myData) return null;

  return (
    <div>
      <Header>
        <img src={gravatar.url(userData.email, { s: '24px', d: 'retro' })} alt={userData.nickname} />  
      </Header>        
      <ChatList />
      <ChatBox chat="d" />
    </div>
  )
}

export default DirectMessage;