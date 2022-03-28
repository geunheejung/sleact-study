import axios, { AxiosError } from 'axios';
import React, { ChangeEvent, useCallback, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import useInput from '@hooks/useInput';
import fetcher from '@utils/fetcher';
import { Success, Form, Error, Label, Input, LinkContainer, Button, Header } from '@pages/SignUp/styles';
import useSWR from 'swr';

const LogIn = () => {
  const { data, error, isValidating, mutate } = useSWR('/api/users', fetcher, {
    dedupingInterval: 1000000, // ms내 새 요청 X 캐싱된 데이터 제공. 
  });

  const [logInError, setLogInError] = useState(false);
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');

  const onSubmit = useCallback(
    (e: ChangeEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLogInError(false);
      
      const data = {
        email, password,
      };
  
      axios.post('/api/users/login', data, {
            withCredentials: true, 
          })
          .then((response) => {
            mutate('/api/users');
          })
          .catch((error) => {
            setLogInError(error.response?.data?.statusCode === 401);
          });
    },
    [email, password]
  );

  // if (isLoading) {
  //   return <div>로딩중...</div>;
  // }

  if (data) {
    return <Navigate to="/workspace/channel" />;
  }

  // console.log(error, userData);
  // if (!error && userData) {
  //   console.log('로그인됨', userData);
  //   return <Redirect to="/workspace/sleact/channel/일반" />;
  // }
  console.log('data', data);

  return (
    <div id="container">
      <Header>Sleact</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
          {logInError && <Error>이메일과 비밀번호 조합이 일치하지 않습니다.</Error>}
        </Label>
        <Button type="submit">로그인</Button>
      </Form>
      <LinkContainer>
        아직 회원이 아니신가요?&nbsp;
        <Link to="/signup">회원가입 하러가기</Link>
      </LinkContainer>
    </div>
  );
};

export default LogIn;
