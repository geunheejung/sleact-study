import Modal from "@components/Modal";
import useInput from "@hooks/useInput";
import { Button, Input, Label } from "@pages/SignUp/styles";
import axios from "axios";
import React, { useCallback, useState } from "react";
import { useSWRConfig } from 'swr';
import { toast } from 'react-toastify';
import { Props } from '@components/Modal';

interface _Props extends Props {
  success?: () => void
}

const CreateChannelModal: React.VFC<_Props> = ({ success, ...modalProps }) => {
  const { mutate } = useSWRConfig();  
  const [newChannel, onChangeNewChannel] = useInput('');  

  const handleSubmit = useCallback(() => {
    
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