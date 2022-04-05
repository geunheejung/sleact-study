import React, { memo, useMemo } from 'react';
import gravatar from 'gravatar';
import dayjs from 'dayjs';
import regexifyString from 'regexify-string';
import { IDM } from '@typings/db';
import { ChatWrapper } from './styles';
import { Link, useParams } from 'react-router-dom';

interface Props {
  data: IDM;
}

const Chat: React.VFC<Props> = ({ data }) => {
  const { 
    content, 
    createdAt, 
    Sender: user,     
  } = data;
  const { workspaceName, dmId } = useParams<{workspaceName: string, dmId: string}>(); 
  
  const result = useMemo(() => {
    const decorator = (match: string, index: number) => {
      
  
      const arr: string[] | null = match.match(/@\[(.+?)]\((\d+?)\)/)!;
      if (arr) {
        return (
          <Link key={match + index} to={`/workspace/${workspaceName}/dm/${
            arr[2]
          }`}>
            @{arr[1]}
          </Link>
        )
      }
  
      return <br key={index} />
    };

    return regexifyString({
      decorator,
      pattern: /@\[(.+?)]\((\d+?)\)|\n/g,
      input: content
    });
  }, [content]);

  return (
    <ChatWrapper>
      <div className="chat-img">
        <img src={gravatar.url(user.email, { s: '36px', d: 'retro' })} alt={user.nickname} />
      </div>
      <div className='chat-text'>
        <div className='chat-user'>
          <b>{user.nickname}</b>
          <span>{dayjs(createdAt).format(`HH:MM`)}</span>
        </div>
        <p>{result}</p>
      </div>
    </ChatWrapper>
  )
}

export default memo(Chat);