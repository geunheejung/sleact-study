import Modal from "@components/Modal";
import useInput from "@hooks/useInput";
import { Button, Input, Label } from "@pages/SignUp/styles";
import axios from "axios";
import React, { useCallback, useState } from "react";
import { useSWRConfig } from 'swr';
import { toast } from 'react-toastify';
import { Props } from '@components/Modal';

interface _Props extends Props {
  success: () => void
}

const CreateWorkspaceModal: React.VFC<_Props> = ({ success, ...modalProps }) => {
  const { mutate } = useSWRConfig();  
  const [newWorkspace, onChangeNewWorkspace, setNewWorkpsace] = useInput('');
  const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');

  const initCreateWorkspaceModal = () => {        
    setNewWorkpsace('');
    setNewUrl('');
    modalProps.onCloseModal();
  }

  const onCreateWorkspace = useCallback((e) => {
    e.preventDefault();
    if (newWorkspace.length <= 0 || newUrl.length <= 0) return;
    axios
      .post('/api/workspaces', {
        workspace: newWorkspace,
        url: newUrl,
      })
      .then(() => {        
        mutate('/api/users');        
        initCreateWorkspaceModal();         
      })
      .catch(error => {
        toast.error(error.response?.data, { position: 'bottom-center' });
      })
  }, [newWorkspace, newUrl]);
  
  console.log(modalProps)

  return (
    <Modal {...modalProps}>
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
  )
}

export default CreateWorkspaceModal;