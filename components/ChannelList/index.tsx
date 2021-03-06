import { CollapseButton } from '@components/DMList/styles';
import { IChannel, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import React, { useCallback, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import useSWR from 'swr';

const ChannelList: React.VFC = () => {      
  const { workspaceName, channelName } = useParams<{workspaceName: string, channelName: string}>();

  const { data: userData } = useSWR<IUser>(
    '/api/users', 
    fetcher
  );
  const { data: channelData } = useSWR<IChannel[]>(
    userData ? `/api/workspaces/${workspaceName}/channels` : null,
    fetcher 
  );  
  
  const [channelCollapse, setChannelCollapse] = useState(false);

  const toggleChannelCollapse = useCallback(() => {
    setChannelCollapse((prev) => !prev);
  }, []);  

  return (
    <>
      <h2>
        <CollapseButton
          collapse={channelCollapse}
          onClick={toggleChannelCollapse}
        >
           <i
            className="c-icon p-channel_sidebar__section_heading_expand p-channel_sidebar__section_heading_expand--show_more_feature c-icon--caret-right c-icon--inherit c-icon--inline"
            data-qa="channel-section-collapse"
            aria-hidden="true"
          />
        </CollapseButton>
        <span>Channels</span>
      </h2>
      <div>
        {!channelCollapse && (
          channelData?.map((channel) => {            
            return (
              <NavLink
                key={channel.id}
                to={`/workspace/${workspaceName}/channel/${channel.name}`}
                className={channelName === channel.name ? 'selected' : undefined} 
              >
                <span># {channel.name}</span>
              </NavLink>
            );
          })
        )}
      </div>
    </>
  )
};

export default ChannelList;