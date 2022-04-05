import React, { useCallback, useRef } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { ChatZone, Section } from '@components/ChatList/styles';
import { IDM } from '@typings/db';
import ChatItem from '@components/ChatItem';

interface Props {
  chatData: IDM[]
}

const ChatList: React.VFC<Props> = ({ chatData }) => {   
  const scrollBarRef = useRef(null);
  const onScroll = useCallback(
    () => {
      
    },
    [],
  );
   
  return (
    <ChatZone>
      <Scrollbars 
        autoHide 
        ref={scrollBarRef} 
        onScrollFrame={onScroll}           
      >       
        <Section>
          {chatData.map((chat, index) => <ChatItem key={index} data={chat} />)}        
        </Section> 
      </Scrollbars>
    </ChatZone>
  )
}

export default ChatList;