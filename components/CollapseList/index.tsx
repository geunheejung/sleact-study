import { CollapseButton } from '@components/DMList/styles';
import React, { useCallback, useState } from 'react';

interface Props {
  title: string
}

const CollapseList: React.FC<Props> = ({ children, title }) => {
  const [channelCollapse, setChannelCollapse] = useState(false);
  
  const toggleCollapse = useCallback(() => {
    setChannelCollapse((prev) => !prev);
  }, []);

  return (
    <>
      <h2>
        <CollapseButton collapse={channelCollapse} onClick={toggleCollapse}>
          <i
            className="c-icon p-channel_sidebar__section_heading_expand p-channel_sidebar__section_heading_expand--show_more_feature c-icon--caret-right c-icon--inherit c-icon--inline"
            data-qa="channel-section-collapse"
            aria-hidden="true"
          />
        </CollapseButton>
        <span>{title}</span>      
      </h2>
      {!channelCollapse && children}
    </>
  );
}

export default CollapseList;