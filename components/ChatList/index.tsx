import React, { useCallback, forwardRef, MutableRefObject } from 'react';
import { positionValues, Scrollbars } from 'react-custom-scrollbars';
import { ChatZone, Section, StickyHeader } from '@components/ChatList/styles';
import { IChat, IDM } from '@typings/db';
import ChatItem from '@components/ChatItem';

interface Props {
  chatSections: { [key: string]: IChat[] | IDM[] };
  setSize: (size: number | ((_size: number) => number)) => Promise<(IDM | IChat)[][] | undefined>;
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
        const current = (ref as MutableRefObject<Scrollbars>)?.current;
        // 페이지 늘어날 시 스크롤 위치 유지
        if (current) {          
                
          current.scrollTop(current.getScrollHeight() - values.scrollHeight); // 현재 스크롤 위치의 height인듯. 스크롤의 최대높이 - 현재 스크롤의 높이 즉 늘어난 만큼 
        }
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