import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { Link, Navigate, Routes, Route, Outlet, useParams } from 'react-router-dom';
import useSWR, { useSWRConfig } from 'swr';
import gravatar from 'gravatar';
import {
  AddButton,
  Channels,
  Chats,
  Header,
  LogOutButton,
  MenuScroll,
  ProfileImg,
  ProfileModal,
  RightMenu,
  WorkspaceButton,
  WorkspaceModal,
  WorkspaceName,
  Workspaces,
  WorkspaceWrapper,
} from '@layouts/WorkSpace/styles';
import Menu from '@components/Menu';
import CreateWorkspaceModal from '@components/CreateChannelModal';
import loadable from '@loadable/component';
import { IChannel, IUser } from '@typings/db';
import CreateChannelModal from '@components/CreateChannelModal';
import InviteWorkspaceModal from '@components/InviteWorkspaceModal';
import ChannelList from '@components/ChannelList';
import DMList from '@components/DMList';
import useSocket from '@hooks/useSocket';

const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));

const Workspace: React.VFC = () => {  
  const { workspaceName, channelName } = useParams<{workspaceName: string, channelName: string}>();
  const { data: userData, mutate: userMutate } = useSWR<IUser>(
    '/api/users', 
    fetcher
  );
  const { data: channelData } = useSWR<IChannel[]>(
    userData ? `/api/workspaces/${workspaceName}/channels` : null,
    fetcher 
  );    
  const { data: memberData }  = useSWR(
    userData ? `/api/workspaces/${workspaceName}/members` : null, 
    fetcher
  );

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [showInviteWorkspaceModal, setShowInviteWorkspaceModal] = useState(false);

  const [ socket, disconnect ] = useSocket(workspaceName);

  useEffect(() => {
    if (channelData && userData && socket) {
      
      socket.emit('login', { id: userData.id, channels: channelData.map(v => v.id) });
      console.log(socket);
      
    }
  }, [channelData, userData, socket])

  useEffect(() => {
    return () => {
      disconnect();
    }
  }, [workspaceName, disconnect]);
  
  
  const onLogout = useCallback(() => {  
    axios.post(`/api/users/logout`, null, {
      withCredentials: true,
    })
    .then((res) => {
      userMutate();
    });  
  }, [])

  const onClickUserProfile = useCallback(() => {
    setShowUserMenu((prev) => !prev);
  }, []);

  const toggleWorkspaceModal = useCallback(() => {
    setShowWorkspaceModal((prev) => !prev);
  }, [])

  const onCloseUserProfile = useCallback((e) => {
    e.stopPropagation();
    setShowUserMenu(false);
  }, [])

  const onClickCreateWorkspace = useCallback(() => { setShowCreateWorkspaceModal(true); }, []);
  const onClickInviteWorkspace = useCallback(() => { setShowInviteWorkspaceModal(true) }, []);  
  const onClickAddChannel = useCallback(() => { setShowCreateChannelModal(true); }, []);

  const onCloseModal = useCallback(() => {
    setShowCreateWorkspaceModal(false);
    setShowCreateChannelModal(false);
    setShowInviteWorkspaceModal(false);
  }, []);

  if (!userData) {    
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <Header>
        <RightMenu>
          <span onClick={onClickUserProfile}>
            <ProfileImg 
              src={gravatar.url(userData.email, { s: '28px', d: 'retro' })} 
              alt={userData.nickname} 
            />              
            {showUserMenu && (
              <Menu
                style={{ right: 0, top: 38 }}
                show={showUserMenu}
                onCloseModal={onCloseUserProfile}
              >                                                      
                <ProfileModal>
                <img 
                  src={gravatar.url(userData.nickname, { s: '36px', d: 'retro' })} 
                  alt={userData.nickname} 
                />
                <div>
                  <span id="profile-name">{userData.nickname}</span>
                  <span id="profile-active">Active</span>
                </div>
                </ProfileModal>
                <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
              </Menu>
              )
            }
          </span>                          
        </RightMenu>
      </Header> 
      <WorkspaceWrapper> 
        <Workspaces>          
          {userData.hasOwnProperty('Workspaces') && userData.Workspaces.map((ws) => {
            return (
              <Link key={ws.id} to={`/workspace/${123}/channel/일반`}>
                <WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
              </Link>
            );
          })}
          <AddButton onClick={onClickCreateWorkspace}>+</AddButton>       
        </Workspaces>  
        <Channels>
          <WorkspaceName onClick={toggleWorkspaceModal}>
            Sleact
          </WorkspaceName>          
          <MenuScroll>
            <Menu 
              show={showWorkspaceModal}
              onCloseModal={toggleWorkspaceModal}
              style={{ top: 95, left: 80 }}  
            >
              <WorkspaceModal>
                <h2>Selact</h2>
                <button onClick={onClickInviteWorkspace}>워크스페이스에 사용자 초대</button>
                <button onClick={onClickAddChannel}>채널 만들기</button>
                <button onClick={onLogout}>로그아웃</button>
              </WorkspaceModal>
            </Menu>
            <ChannelList />           
            <DMList />
          </MenuScroll>
        </Channels>
        <Chats>
          <Routes>
            <Route path="channel/:channelName" element={<Channel />} />
            <Route path="dm/:id" element={<DirectMessage />} />                
          </Routes>
        </Chats> 
      </WorkspaceWrapper>     
      <CreateWorkspaceModal         
        show={showCreateWorkspaceModal}
        onCloseModal={onCloseModal}
      />
      <CreateChannelModal 
        show={showCreateChannelModal}
        onCloseModal={onCloseModal}
      />      
      <InviteWorkspaceModal 
        show={showInviteWorkspaceModal}
        onCloseModal={onCloseModal}
      />
    </div>
  )
}

export default Workspace;