import React, { useCallback, useRef } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { ChatZone, Section, StickyHeader } from '@components/ChatList/styles';
import { IDM } from '@typings/db';
import ChatItem from '@components/ChatItem';

interface Props {
  chatSections: { [key: string]: IDM[] };
}

const ChatList: React.VFC<Props> = ({ chatSections }) => {   
  const scrollBarRef = useRef(null);
  const onScroll = useCallback(() => {}, []);
   
  return (
    <ChatZone>
      <Scrollbars 
        autoHide 
        ref={scrollBarRef} 
        onScrollFrame={onScroll}           
      >   
        {
          Object.entries(chatSections).map(([ date, chats ], index) => (
            <Section className={`section-${date}`} key={date}>
              <StickyHeader>
                <button>{date}</button>
              </StickyHeader>
              {chats.map(chat => (
                <ChatItem key={chat.id} data={chat} />
              ))}
            </Section>            
          ))
        }                    
      </Scrollbars>
    </ChatZone>
  )
}

export default ChatList;