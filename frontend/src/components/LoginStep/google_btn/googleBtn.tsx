import React from 'react';
import styled from 'styled-components';
import { FcGoogle } from 'react-icons/fc';
import { GOOGLE_OAUTH } from 'components/LoginStep/google_btn/GoogleAuth';

const googleBtn = () => {
  return (
    <>
      <LoginBtn href={GOOGLE_OAUTH}>
        <FcGoogle size={50} />
        <div>구글로 로그인하기</div>
      </LoginBtn>
    </>
  );
};

export default googleBtn;

const LoginBtn = styled.a`
  ${({ theme }) => theme.flexMixIn('center', 'center')};
  border: none;
  background: none;
  font-size: ${({ theme }) => theme.fontMedium};
  font-weight: ${({ theme }) => theme.weightBold};
  cursor: pointer;
  color: black;

  div {
    height: 50px;
    margin-left: 5px;
    line-height: 50px;
    font-family: 'Jua', sans-serif;

    &:hover {
      color: ${({ theme }) => theme.mainViolet};
      opacity: 0.8;
    }
  }
`;
