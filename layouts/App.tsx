import React, { FC } from 'react';
import loadable from '@loadable/component';
import { Routes, Route, Navigate } from "react-router-dom";

// 알아서 코드스플리팅, 로드해올지 해준다.
const Login = loadable(() => import('@pages/Login'));
const SignUp = loadable(() => import('@pages/SignUp'));
const Workspace = loadable(() => import('@layouts/WorkSpace'));

const App = () => (
  <Routes>          
    <Route 
      path='/'
      element={<Navigate replace to="/login" />}
    />
    <Route path="login" element={<Login />} />
    <Route path="signup" element={<SignUp />} />
    <Route path="workspace/:workspaceName" element={<Workspace />}>
      <Route path="channel/:channelName" element={<Workspace />} />
      <Route path="dm/:dmId" element={<Workspace />} />
    </Route>
    
  </Routes>
)

export default App;
