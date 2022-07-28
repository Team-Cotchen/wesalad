import React from 'react';
import styled, { keyframes } from 'styled-components';
import { ITitle } from 'components/LoginStep/loginStep.types';
import GoogleButton from 'components/LoginStep/google_btn/googleBtn';
import { devices } from 'styles/devices';

const setLoginSection = () => {
  return (
    <>
      <LoginSection>
        <Title fontSize="80px" marginBottom="40px">
          환영합니다!
        </Title>
        <SubTitle fontSize="24px" marginBottom="70px">
          우선, 로그인부터 해볼까요?
        </SubTitle>
        <BtnSection>
          <GoogleButton />
        </BtnSection>
      </LoginSection>
    </>
  );
};

export default setLoginSection;

const TitleHightLight = keyframes`
  0% {
    width:0%;
    box-shadow: inset 0 -25px #2de466;
  }
  50% {
    width:30%;
    box-shadow: inset 0 -25px #2de466;
  }
  100% {
    width:60%;
    box-shadow: inset 0 -25px #2de466;
  }
`;

const SubTitleHightLight = keyframes`
  0% {
    width:0%;
    box-shadow: inset 0 -25px #2de466;
  }
  50% {
    width:20%;
    box-shadow: inset 0 -25px #2de466;
  }
  100% {
    width:40%;
    box-shadow: inset 0 -25px #2de466;
  }
`;

const LoginSection = styled.div`
  padding: 4rem;
`;

const Title = styled.h1<ITitle>`
  margin-bottom: ${({ marginBottom }) => marginBottom};
  font-size: ${({ fontSize }) => fontSize};
  font-weight: 800;

  &:after {
    content: '';
    display: block;
    width: 60%;
    height: 40px;
    position: absolute;
    background: #2de466;
    transform: translateY(-40px);
    z-index: -100;
    animation: ${TitleHightLight} 1.5s linear;
  }

  @media ${devices.laptop} {
    font-size: 60px;
  }

  @media ${devices.tablet} {
    font-size: ${({ theme }) => theme.fontLarge};
  }
`;

const SubTitle = styled.h1<ITitle>`
  margin-bottom: ${({ marginBottom }) => marginBottom};
  height: 40px;
  font-size: ${({ fontSize }) => fontSize};
  font-weight: ${({ theme }) => theme.weightBold};

  &:after {
    content: '';
    display: block;
    width: 40%;
    height: 20px;
    position: absolute;
    transform: translateY(-10px);
    z-index: -100;
    animation: ${SubTitleHightLight} 1.5s linear;
    animation-delay: 1s;
    animation-fill-mode: forwards;

    @media ${devices.laptop} {
      display: none;
    }
  }
`;

const BtnSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: none;
  cursor: pointer;
`;
