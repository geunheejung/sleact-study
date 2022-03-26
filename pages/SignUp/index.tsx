import React, { useCallback, useState } from 'react';
import { Button, Error, Form, Header, Input, Label, LinkContainer, Success } from '@pages/SignUp/styles';
import { useInput } from '@hooks/useInput';

const SignUp = () => {  
  const [email, onChangeEmail] = useInput<string>('');
  const [nickname, onChangeNickname] = useInput<string>('');
  const [password, , setPassword] = useInput<string>('');
  const [passwordCheck, , setPasswordCheck] = useInput<string>('');
  const [mismatchError, , setMismatchError] = useInput<boolean>(false);
  
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
      if (mismatchError) return;

      console.log(
        email, 'email', nickname, 'nickname', password, 'password', mismatchError, 'mismatchError'
      )
    },
    [email, nickname, password, mismatchError],
  );

  // if (userData) {
  //   // return <Redirect to="/workspace/sleact" />;  
  // }
  
  console.log(mismatchError)
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
          {/* {signUpError && <Error>이미 가입된 이메일입니다.</Error>} */}
          {/* {signUpSuccess && <Success>회원가입되었습니다! 로그인해주세요.</Success>} */}
        </Label>
        <Button type="submit">회원가입</Button>
      </Form>
      <LinkContainer>
        이미 회원이신가요?&nbsp;
        <a href="/login">로그인 하러가기</a>
      </LinkContainer>
    </div>
  );
};

export default SignUp;