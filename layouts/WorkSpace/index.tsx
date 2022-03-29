import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { Link, Navigate, Routes, Route } from 'react-router-dom';
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
import { Label, Button, Input } from '@pages/SignUp/styles';
import Menu from '@components/Menu';
import Modal from '@components/Modal';
import useInput from '@hooks/useInput';

const Workspace: React.FC = ({ children }) => {
  const { mutate } = useSWRConfig();
  const { data: userData, error: loginError } = useSWR('/api/users', fetcher);

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [newWorkspace, onChangeNewWorkspace, setNewWorkpsace] = useInput('');
  const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');

  const onLogout = useCallback(() => {  
    axios.post(`/api/users/logout`, null, {
      withCredentials: true,
    })
    .then((res) => {
      mutate('/api/users', undefined);
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

  const onClickCreateWorkspace = useCallback(() => {}, []);

  const onClickInviteWorkspace = useCallback(() => {}, []);
  const onClickAddChannel = useCallback(() => {}, []);
  const onCloseModal = useCallback(() => {
    setShowCreateWorkspaceModal(prev => !prev);
  }, []);
  const onCreateWorkspace = useCallback(() => {}, []);

  if (!userData) {
    return <Navigate to="/login" />;
  }

  console.log('userData =>', userData);
  
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
          {userData?.Workspaces.map((ws: any) => {
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
            {/* <ChannelList /> */}
            {/* <DMList /> */}
          </MenuScroll>
        </Channels>
        <Chats>
          <Routes>
            <Route path="/workspace/:workspace/channel/:channel" element={<div />} />
            <Route path="/workspace/:workspace/dm/:id" element={<div />} />    
          </Routes>
        </Chats> 
      </WorkspaceWrapper>     
      <Modal
        show={showCreateWorkspaceModal}
        onCloseModal={onCloseModal}
      >
        <form onSubmit={onCreateWorkspace}>
          <Label id="workspace-label">
            <span>워크스페이스 이름</span>
            <Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace} />
          </Label>
          <Label id="workspace-url-label">
            <span>워크스페이스 url</span>
            <Input id="workspace" value={newUrl} onChange={onChangeNewUrl} />
          </Label>
          <Button type="submit">생성하기</Button>
        </form>
      </Modal>
    </div>
  )
}

export default Workspace;