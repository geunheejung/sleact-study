import React from 'react';
import gravatar from 'gravatar';
import { IDM } from '@typings/db';
import { ChatWrapper } from './styles';

interface Props {
  data: IDM;
}

const Chat: React.VFC<Props> = ({ data }) => {
  const { 
    content, 
    createdAt, 
    Sender: user,     
  } = data;
  return (
    <ChatWrapper>
      <div className="chat-img">
        <img src={gravatar.url(user.email, { s: '36px', d: 'retro' })} alt={user.nickname} />
      </div>
      <div className='chat-text'>
        <div className='chat-user'>
          <b>{user.nickname}</b>
          <span>{createdAt}</span>
        </div>
        <p>{content}</p>
      </div>
    </ChatWrapper>
  )
}

export default Chat;