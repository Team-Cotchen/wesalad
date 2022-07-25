import React, { useState } from 'react';
import styled from 'styled-components';
import API from 'config';
import { ITitle } from 'components/LoginStep/loginStep.types';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import { QuestionData } from 'assets/data/QuestionData';
import { keyframes } from 'styled-components';
import { devices } from 'styles/devices';

const setResultSection = ({ handleClose, basicInfo }: any) => {
  const tendencyResult: number[] = basicInfo.answers;
  // const id = useSelector((state: RootState) => state.login.id);
  const id = 7;

  const fetchByUserInfo = async () => {
    const stacksToString = String(basicInfo.stacks);
    const answerToString = String(basicInfo.answers);
    const ordinalToNumber = Number(basicInfo.ordinal_number);

    const setFetchFormData = {
      name: basicInfo.name,
      ordinal_number: ordinalToNumber,
      answers: answerToString,
      stacks: stacksToString,
    };

    try {
      const res = await axios({
        method: 'post',
        url: `${API.signup}/${id}`,
        headers: {
          'Content-Type': 'application/json',
        },
        data: setFetchFormData,
      });

      if (res.status === 201) handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <ResultSection>
        <Header>
          <Title fontSize="80px">감사합니다!</Title>
          <SubTitle fontSize="30px">결과는 다음과 같아요</SubTitle>
        </Header>
        <ResultWindowSection>
          {tendencyResult?.map((item, i) =>
            item === 0 ? (
              <Card key={i}>{QuestionData[i].resultA}</Card>
            ) : (
              <Card key={i}>{QuestionData[i].resultB}</Card>
            ),
          )}
        </ResultWindowSection>
        <SubmitSection>
          <SubmitBtn mode="submit" onClick={fetchByUserInfo}>
            시작하기
          </SubmitBtn>
        </SubmitSection>
      </ResultSection>
    </>
  );
};

export default setResultSection;

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

const ResultSection = styled.div`
  padding: 2rem 4rem 0rem 4rem;
`;

const Header = styled.div``;

const Title = styled.h1<ITitle>`
  font-size: ${({ fontSize }) => fontSize};
  text-align: start;
  margin-bottom: 10px;

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
  font-size: ${({ fontSize }) => fontSize};
  font-weight: ${({ theme }) => theme.weightBold};
  text-align: start;
  margin-bottom: 0;

  @media ${devices.laptop} {
    font-size: 40px;
  }

  @media ${devices.tablet} {
    font-size: ${({ theme }) => theme.fontMedium};
  }
`;

const ResultWindowSection = styled.div`
  background: '#2DE466';
  padding: 10px 10px;
  border-radius: 30px;

  @media ${devices.laptop} {
    margin: 1rem 0;
    height: 10rem;
    overflow: scroll;
  }

  @media ${devices.tablet} {
    margin: 2rem 0;
  }
`;

const SubmitSection = styled.div`
  ${({ theme }) => theme.flexMixIn('end', 'center')}
`;

const SubmitBtn = styled.button<{ mode: string }>`
  height: 2.5rem;
  background-color: ${({ theme }) => theme.mainGreen};
  color: white;
  padding: 0 8px;

  border: none;
  border-radius: 10px;
  font-size: ${({ theme }) => theme.fontSemiMedium};
  font-family: 'Jua', sans-serif;
  cursor: pointer;

  @media ${devices.mobile} {
    font-size: ${({ theme }) => theme.fontSmall};
  }
`;

const Card = styled.li`
  display: inline-block;
  flex: 1;
  padding: 20px;
  margin: 10px 10px;
  background: ${({ theme }) => theme.mainGreen};
  border-radius: 10px;
  font-size: ${({ theme }) => theme.fontSmall};
  color: white;

  @media ${devices.laptop} {
    padding: 15px;
    margin: 10px 10px;
  }

  @media ${devices.tablet} {
    padding: 5px;
    margin: 10px 10px;
  }
`;
