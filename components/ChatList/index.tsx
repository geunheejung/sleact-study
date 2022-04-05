import React, { useCallback, forwardRef } from 'react';
import { positionValues, Scrollbars } from 'react-custom-scrollbars';
import { ChatZone, Section, StickyHeader } from '@components/ChatList/styles';
import { IDM } from '@typings/db';
import ChatItem from '@components/ChatItem';

interface Props {
  chatSections: { [key: string]: IDM[] };
  setSize: (size: number | ((_size: number) => number)) => Promise<IDM[][] | undefined>;
  isEmpty: boolean;
  isReachingEnd: boolean;
}

const ChatList = forwardRef<Scrollbars, Props>(({ 
  chatSections,
  setSize,
  isEmpty,
  isReachingEnd,
}, ref) => {   
  const onScroll = useCallback((values: positionValues) => {    
    if (values.scrollTop === 0 && !isReachingEnd) {      
      setSize((prevSize: number) => prevSize + 1)
      .then(() => {
        // 스크롤 위치 유지
      });
    }
  }, []);
   
  return (
    <ChatZone>
      <Scrollbars 
        autoHide 
        ref={ref} 
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
});

export default ChatList;