import React from 'react';
import styled from 'styled-components';
import API from 'config';
import { ITitle } from 'components/LoginStep/loginStep.types';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import { QuestionData } from 'assets/data/QuestionData';
import { keyframes } from 'styled-components';
import { devices } from 'styles/devices';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

const setResultSection = ({ handleClose, basicInfo }: any) => {
  const tendencyResult = basicInfo.answers as number[];
  const answerChangeForm: string[] = [];
  const id = useSelector((state: RootState) => state.login.signupId);
  const navigate = useNavigate();

  const changeToFetchForm = () => {
    tendencyResult.map((item, i) => {
      item === 0
        ? answerChangeForm.push(QuestionData[i].resultA)
        : answerChangeForm.push(QuestionData[i].resultB);
    });

    return answerChangeForm;
  };

  const fetchByUserInfo = async () => {
    const stacksToString = String(basicInfo.stacks);
    const answerToString = String(changeToFetchForm());
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

      if (res.status === 201) {
        message.success('축하드려요! 가입되었습니다. 🙌');
      }

      if (res.data.token !== undefined) {
        const token = res.data.token;
        localStorage.setItem('accessToken', token.access);
        localStorage.setItem('refreshToken', token.refresh);
      }

      handleClose();
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <ResultSection>
        <Header>
          <Title fontSize="80px">감사합니다!</Title>
          <SubTitle fontSize="25px">
            설정창에서 <span>성향 및 스택</span>을 확인할 수 있어요! 🎉
          </SubTitle>
        </Header>
        {/* TODO: 수정예정 */}
        {/* <ResultWindowSection>
          {tendencyResult.map((item, i) =>
            item === 0 ? (
              <Card key={i}>
                <Icon src={QuestionData[i].image_urlA} />
                {QuestionData[i].resultA}
              </Card>
            ) : (
              <Card key={i}>
                <Icon src={QuestionData[i].image_urlB} />
                {QuestionData[i].resultB}
              </Card>
            ),
          )}
        </ResultWindowSection> */}
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
  padding: 7rem 4rem 0rem 4rem;
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

  span {
    color: ${({ theme }) => theme.mainViolet};
  }

  @media ${devices.laptop} {
    font-size: 40px;
  }

  @media ${devices.tablet} {
    font-size: ${({ theme }) => theme.fontMedium};
  }
`;

const ResultWindowSection = styled.div`
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
  padding: 10px;
  margin: 10px 10px;
  background: white;
  font-size: ${({ theme }) => theme.fontSmall};
  border-radius: 20px;
  border: 1px solid #dbdbdb;

  @media ${devices.laptop} {
    padding: 15px;
    margin: 10px 10px;
  }

  @media ${devices.tablet} {
    padding: 5px;
    margin: 10px 10px;
  }
`;

const Icon = styled.img`
  margin-right: 4px;
  width: 21px;
  height: 21px;
`;
