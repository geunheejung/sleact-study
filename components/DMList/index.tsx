import React, { useState } from 'react';
import CollapseList from '@components/CollapseList';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import { IUser } from '@typings/db';
import { NavLink, useParams } from 'react-router-dom';

const DMList: React.FC= () => {     
  const { workspaceName, channelName } = useParams<{workspaceName: string, channelName: string}>(); 
  const [onlineList, setOnlineList] = useState<number[]>([]);
  const { data: userData, mutate: userMutate } = useSWR<IUser>(
    '/api/users', 
    fetcher
  );
  const { data: memberData }  = useSWR<IUser[]>(
    userData ? `/api/workspaces/${workspaceName}/members` : null, 
    fetcher
  );
  
  return (
    <>
      <CollapseList title="Direct Messages">
        {
          memberData?.map((member) => {
            const isOnline = onlineList.includes(member.id);
            return (
              <NavLink 
                key={member.id} 
                className={({isActive}) => isActive ? 'selected' : undefined}  
                to={`/workspace/${workspaceName}/dm/${member.id}`}
              >
                <i
                  className={`c-icon p-channel_sidebar__presence_icon p-channel_sidebar__presence_icon--dim_enabled c-presence ${
                    isOnline ? 'c-presence--active c-icon--presence-online' : 'c-icon--presence-offline'
                  }`}
                  aria-hidden="true"
                  data-qa="presence_indicator"
                  data-qa-presence-self="false"
                  data-qa-presence-active="false"
                  data-qa-presence-dnd="false"
                />
                <span>{member.nickname}</span>
                {member.id === userData?.id && <span>(나)</span>}
              </NavLink>
            )
          })
        }
      </CollapseList>
    </>
  )
};

export default DMList;