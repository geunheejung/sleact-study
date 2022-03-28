import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { useCallback } from 'react';
import { Navigate } from 'react-router';
import useSWR, { useSWRConfig } from 'swr';

const Workspace: React.FC = ({ children }) => {
  const { data, error, isValidating, mutate } = useSWR('/api/users', fetcher); 

  const onLogout = useCallback(() => {  
    axios.post(`/api/users/logout`, null, {
      withCredentials: true,
    })
    .then(() => {
      mutate('/api/users'); 
    });  
  }, [])

  if (!data) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <button onClick={onLogout}>로그아웃</button>
      {children}
    </div>
  )
}

export default Workspace;