import Modal from "@components/Modal";
import useInput from "@hooks/useInput";
import { Button, Input, Label } from "@pages/SignUp/styles";
import axios from "axios";
import React, { useCallback, useState } from "react";
import { useSWRConfig } from 'swr';
import { toast } from 'react-toastify';
import { Props } from '@components/Modal';
import { useParams } from "react-router";

interface _Props extends Props {
  success?: () => void
}

const InviteWorkspaceModal: React.VFC<_Props> = ({ success, ...modalProps }) => {
  const { mutate } = useSWRConfig();  
  const [newMember, onChangeNewMember, setNewMember] = useInput('');   
  const { workspaceName, channelName } = useParams<{workspaceName: string, channelName: string}>();
  
  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    if (newMember.length <= 0) return;

    axios.post(
      `/api/workspaces/${workspaceName}/channels/${channelName}/members`, 
      { email: newMember }
    )
    .then((res) => {
      mutate(`/api/workspaces/${workspaceName}/members`);
      modalProps.onCloseModal();
      setNewMember('');
    })
    .catch((error) => {
      toast.error(error.response?.data, { position: 'bottom-center' });
    });
  }, [ newMember ])
  
  return (
    <Modal {...modalProps}>
      <form onSubmit={handleSubmit}>
        <Label id="channel-member-label">
          <span>채널 멤버 초대</span>
          <Input 
            id="channel-member" 
            value={newMember} 
            onChange={onChangeNewMember} 
          />
        </Label>        
        <Button type="submit">초대하기</Button>
      </form>
    </Modal>
  )
}

export default InviteWorkspaceModal;