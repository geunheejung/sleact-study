import React, { useCallback } from 'react'
import { ChatArea, Form, MentionsTextarea, SendButton, Toolbox } from '@components/ChatBox/styles';
import { Mention } from 'react-mentions';

interface Props {
  chat: String  
}

const ChatBox: React.VFC<Props> = ({ chat }) => {
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
  }, []);

  return (
    <ChatArea>
      <Form onSubmit={handleSubmit}>
        <MentionsTextarea
          id="editor-chat"
          // value={chat}
          // onChange={onChangeChat}
          // onKeyPress={onKeydownChat}
          // placeholder={placeholder}
          // inputRef={textareaRef}
          allowSuggestionsAboveCursor
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