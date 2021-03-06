import React, { useCallback, useState } from 'react';
import axios from 'axios';
import { Link, Navigate } from 'react-router-dom';
import { Button, Error, Form, Header, Input, Label, LinkContainer, Success } from '@pages/SignUp/styles';
import useInput from '@hooks/useInput';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';

const SignUp = () => {  
  const { data, error, isValidating, mutate } = useSWR('/api/users', fetcher); 
  const [email, onChangeEmail] = useInput<string>('');
  const [nickname, onChangeNickname] = useInput<string>('');
  const [password, , setPassword] = useInput<string>('');
  const [passwordCheck, , setPasswordCheck] = useInput<string>('');
  const [mismatchError, , setMismatchError] = useInput<boolean>(false);
  const [signUpError, setSignUpError] = useState('');
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  
  const onChangePassword = useCallback(
    (e) => {
      setPassword(e.target.value);
      setMismatchError(e.target.value === passwordCheck);                      
    },
    [passwordCheck],
  );

  const onChangePasswordCheck = useCallback(
    (e) => { 
      // 함수 기준으로 외부 변수일 경우 deps에 서술해야한다. 값이 변경되지 않는것은 서술 X
      setPasswordCheck(e.target.value);
      setMismatchError(e.target.value !== password);      
    },
    [password],
  );

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();    
      if (mismatchError || !nickname) return;

      setSignUpError('')
      setSignUpSuccess(false);
            
      axios.post('/api/users', {
         email,
         nickname,
         password
       })
       .then(res => {
         console.log(res, 'res');
         setSignUpSuccess(true);
       })
       .catch(err => {
        setSignUpError(err.response.data);
       })
       .finally(() => {})
    },
    [email, nickname, password, mismatchError],
  );

  if (data) {    
    return <Navigate to="/workspace/sleact/channel/일반" />;
  }
  
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
        <Label id="nickname-label">
          <span>닉네임</span>
          <div>
            <Input type="text" id="nickname" name="nickname" value={nickname} onChange={onChangeNickname} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
        </Label>
        <Label id="password-check-label">
          <span>비밀번호 확인</span>
          <div>
            <Input
              type="password"
              id="password-check"
              name="password-check"
              value={passwordCheck}
              onChange={onChangePasswordCheck}
            />
          </div>
          {mismatchError && <Error>비밀번호가 일치하지 않습니다.</Error>}
          {!nickname && <Error>닉네임을 입력해주세요.</Error>}
          {signUpError && <Error>{signUpError}</Error>}
          {signUpSuccess && <Success>회원가입되었습니다! 로그인해주세요.</Success>}
        </Label>
        <Button type="submit">회원가입</Button>
      </Form>
      <LinkContainer>
        이미 회원이신가요?&nbsp;
        <Link to="/login">로그인 하러가기</Link>        
      </LinkContainer>
    </div>
  );
};

export default SignUp;
