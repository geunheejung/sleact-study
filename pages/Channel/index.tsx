import React, { useCallback } from 'react';
import { Container, Header } from '@pages/Channel/styles';
import ChatBox from '@components/ChatBox';
import useInput from '@hooks/useInput';

const Channel = () => {
  const [ chat, onChangeChat ] = useInput('');

  const onSubmitForm = useCallback((e) => {
    e.preventDefault();    
  }, [chat]);
  
  return (
    <Container>
      <Header>
        채널
      </Header>
      <ChatBox 
        chat={chat}
        onSubmitForm={onSubmitForm}
        onChangeChat={onChangeChat}
      />
    </Container>
  )
}

export default Channel;