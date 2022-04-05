import React, { useCallback, useEffect, useRef } from 'react'
import { ChatArea, EachMention, Form, MentionsTextarea, SendButton, Toolbox } from '@components/ChatBox/styles';
import { Mention, MentionProps, SuggestionDataItem } from 'react-mentions';
import autosize from 'autosize';
import useSWR from 'swr';
import gravatar from 'gravatar'
import fetcher from '@utils/fetcher';
import { IUser } from '@typings/db';
import { useParams } from 'react-router-dom';

interface Props {
  chat: string;
  // placeholder: string;
  onSubmitForm: (e: any) => void;
  onChangeChat: (e: any) => void;  
}

const ChatBox: React.VFC<Props> = ({ chat, onSubmitForm, onChangeChat }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { workspaceName, dmId } = useParams<{workspaceName: string, dmId: string}>(); 

  const { data: userData, mutate: userMutate } = useSWR<IUser>(
    '/api/users', 
    fetcher
  );
  const { data: memberData } = useSWR<IUser[]>(
    userData ? `/api/workspaces/${workspaceName}/members` : null, 
    fetcher
  );

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
  
  const renderSuggestion = useCallback(
    (
      suggestion: SuggestionDataItem,
      search: string,
      highlightedDisplay: React.ReactNode,
      index: number,
      focus: boolean,
    ): React.ReactNode => {
      if (!memberData) return;
      return (
        <EachMention focus={focus}>
          <img
            src={gravatar.url(memberData[index].email, { s: '20px', d: 'retro' })}
            alt={memberData[index].nickname}
          />
          <span>{highlightedDisplay}</span>
        </EachMention>
      );
    },
    [memberData],
  );

  return (
    <ChatArea>
      <Form onSubmit={onSubmitForm}>
      <MentionsTextarea
          id="editor-chat"
          value={chat}
          allowSuggestionsAboveCursor
          onChange={onChangeChat}
          onKeyPress={onKeydownChat}          
          inputRef={textareaRef}
          
        >
          <Mention
            appendSpaceOnAdd
            trigger="@"
            data={memberData?.map((v) => ({ id: v.id, display: v.nickname })) || []}
            renderSuggestion={renderSuggestion}
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