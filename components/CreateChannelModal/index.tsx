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

const CreateChannelModal: React.VFC<_Props> = ({ success, ...modalProps }) => {
  const { mutate } = useSWRConfig();  
  const [newChannel, onChangeNewChannel, setChangeNewChannel] = useInput('');   
  const { workspaceName } = useParams<{workspaceName: string, channelName: string}>();
  

  const handleSubmit = useCallback((e) => {    
    e.preventDefault();

    axios.post(
      `/api/workspaces/${workspaceName}/channels`, 
      { name: newChannel }, { withCredentials: true }
    )
    .then(() => {          
      setChangeNewChannel('');
      mutate(`/api/workspaces/${workspaceName}/channels`);
      modalProps.onCloseModal();      
    })
    .catch((error) => {    
      toast.error(error.response?.data, { position: 'bottom-center' });
    })
  }, [newChannel]);  

  return (
    <Modal {...modalProps}>
      <form onSubmit={handleSubmit}>
        <Label id="workspace-label">
          <span>채널</span>
          <Input 
            id="workspace" 
            value={newChannel} 
            onChange={onChangeNewChannel} 
          />
        </Label>        
        <Button type="submit">생성하기</Button>
      </form>
    </Modal>
  )
}

export default CreateChannelModal;