import React, { useCallback, useEffect, useRef } from 'react'
import { ChatArea, Form, MentionsTextarea, SendButton, Toolbox } from '@components/ChatBox/styles';
import { Mention } from 'react-mentions';
import autosize from 'autosize';

interface Props {
  chat: string;
  // placeholder: string;
  onSubmitForm: (e: any) => void;
  onChangeChat: (e: any) => void;  
}

const ChatBox: React.VFC<Props> = ({ chat, onSubmitForm, onChangeChat }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (textareaRef.current) {
      autosize(textareaRef.current);
    }
  }, []);
  

  const onKeydownChat = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      if (!e.shiftKey) {
        e.preventDefault();
        onSubmitForm(e);
      }
    }
  }, [onSubmitForm]);  

  return (
    <ChatArea>
      <Form onSubmit={onSubmitForm}>
        <MentionsTextarea      
          id="editor-chat"
          value={chat}
          onChange={onChangeChat}
          onKeyPress={onKeydownChat}
          // placeholder={placeholder}
          inputRef={textareaRef}
          // allowSuggestionsAboveCursor 
        >
          <Mention
            appendSpaceOnAdd
            trigger="@"
            // data={memberData?.map((v) => ({ id: v.id, display: v.nickname })) || []}
            data={[]}
            // renderSuggestion={renderSuggestion}
          />
        </MentionsTextarea>
        <Toolbox>
          <SendButton>
            <i className="c-icon c-icon--paperplane-filled" aria-hidden="true" />
          </SendButton>
        </Toolbox>
      </Form>
    </ChatArea>
  )
}

export default ChatBox;