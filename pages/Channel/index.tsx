import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import InviteChannelModal from '@components/InviteChannelModal';
import useInput from '@hooks/useInput';
import useSocket from '@hooks/useSocket';
import { Header, Container } from '@pages/Channel/styles';
import { IChannel, IChat, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import makeSection from '@utils/makeSection';
import axios from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';

const PAGE_SIZE = 20;
const Channel = () => {
  const { workspaceName: workspace, channelName: channel } = useParams<{workspaceName: string, channelName: string}>();  

  const [socket] = useSocket(workspace);

  const { data: userData } = useSWR<IUser>('/api/users', fetcher);

  const { data: channelsData } = useSWR<IChannel[]>(`/api/workspaces/${workspace}/channels`, fetcher);
  const channelData = channelsData?.find((v) => v.name === channel);

  const { data: chatData, mutate: mutateChat, setSize } = useSWRInfinite<IChat[]>(
    (index: number) => `/api/workspaces/${workspace}/channels/${channel}/chats?perPage=${PAGE_SIZE}&page=${index + 1}`,
    fetcher,
  );

  const { data: channelMembersData } = useSWR(
    userData ? `/api/workspaces/${workspace}/channels/${channel}/members` : null,
    fetcher,
  );

  const [chat, onChangeChat, setChat] = useInput('');
  const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);

  const scrollBarRef = useRef<Scrollbars>(null);

  const isEmpty = chatData?.[0]?.length === 0;
  const isReachingEnd = isEmpty || !!(chatData && chatData[chatData.length - 1]?.length < PAGE_SIZE);

  const onCloseModal = useCallback(() => {
    setShowInviteChannelModal(false);
  }, []);

  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      if (chat?.trim() && chatData && channelData && userData) {
        const savedChat = chat;
        mutateChat((prevChatData) => {
          prevChatData?.[0].unshift({
            id: (chatData[0][0]?.id || 0) + 1,
            content: savedChat,
            UserId: userData.id,
            User: userData,
            createdAt: new Date(),
            ChannelId: channelData.id,
            Channel: channelData,
          });
          return prevChatData;
        }, false).then(() => {
          setChat('');
          if (scrollBarRef.current) {            
            scrollBarRef.current.scrollToBottom();
          }
        });
        axios
          .post(`/api/workspaces/${workspace}/channels/${channel}/chats`, {
            content: savedChat,
          })
          .then(() => { mutateChat() })
          .catch(console.error);
      }
    },
    [chat, workspace, channel, channelData, userData, chatData],
  );

  const onMessage = (data: IChat) => {
    if (data.Channel.name === channel && data.UserId !== userData?.id) {
      mutateChat((chatData) => {
        chatData?.[0].unshift(data);
        return chatData;
      }, false).then(() => {
        if (scrollBarRef.current) {
          if (
            scrollBarRef.current.getScrollHeight() <
            scrollBarRef.current.getClientHeight() + scrollBarRef.current.getScrollTop() + 150
          ) {
            console.log('scrollToBottom!', scrollBarRef.current?.getValues());
            scrollBarRef.current.scrollToBottom();
          } else {
            toast.success('새 메시지가 도착했습니다.', {
              onClick() {
                scrollBarRef.current?.scrollToBottom();
              },
              closeOnClick: true,
            });
          }
        }
      });
    }
  };

  useEffect(() => {
    socket?.on('message', onMessage);
    return () => {
      socket?.off('message', onMessage);
    };
  }, [socket, userData]);

  useEffect(() => {
    if (chatData?.length === 1) {
      console.log('toBottomWhenLoaded', chatData, scrollBarRef.current?.getValues());
      scrollBarRef.current?.scrollToBottom();
    }
  }, [chatData]);

  const onClickInviteChannel = useCallback(() => {
    setShowInviteChannelModal(true);
  }, []);

  if (channelsData && !channelData) {
    return <Link to={`/workspace/${workspace}/channel/일반`} />;
  }

  const chatSections = makeSection<IChat>(chatData ? chatData.flat().reverse() : []);

  return (
    <Container>
      <Header>
        <span>#{channel}</span>
        <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
          <span>{channelMembersData?.length}</span>
          <button
            onClick={onClickInviteChannel}
            className="c-button-unstyled p-ia__view_header__button"
            aria-label="Add people to #react-native"
            data-sk="tooltip_parent"
            type="button"
          >
            <i className="c-icon p-ia__view_header__button_icon c-icon--add-user" aria-hidden="true" />
          </button>
        </div>
      </Header>
      <ChatList
        ref={scrollBarRef}
        isReachingEnd={isReachingEnd}
        isEmpty={isEmpty}
        chatSections={chatSections}
        setSize={setSize}
      />
      <ChatBox
        onSubmitForm={onSubmitForm}
        chat={chat}
        onChangeChat={onChangeChat}
        placeholder={`Message #${channel}`}
        // data={channelMembersData}
      />
      <InviteChannelModal
        show={showInviteChannelModal}
        onCloseModal={onCloseModal}        
      />
      <ToastContainer position="bottom-center" />
    </Container>
  );
};

export default Channel;
