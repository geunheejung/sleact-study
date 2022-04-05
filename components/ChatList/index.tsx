import React from 'react';
import { ChatZone, Section } from '@components/ChatList/styles';
import { IDM } from '@typings/db';
import ChatItem from '@components/ChatItem';

interface Props {
  chatData: IDM[]
}

const ChatList: React.VFC<Props> = ({ chatData }) => {    
  return (
    <ChatZone>
      <div>
        {chatData.map((chat, index) => {
          return (
            <ChatItem key={chat.id * index} data={chat} />          
          )
        })}
      </div>
    </ChatZone>
  )
}

export default ChatList;