import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import API from 'config';
import {
  ITitle,
  ModalProps,
  IFetchResultData,
} from 'components/LoginStep/loginStep.types';
import axios from 'axios';

const setResultSection = ({ handleClose }: ModalProps) => {
  const [tendencyResult, setTendencyResult] = useState<IFetchResultData>();

  // const fetchByUserResult = async () => {
  //   try {
  //     const { data } = await axios.get(`${API.login}`);

  //     setTendencyResult(data);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // useEffect(() => {
  //   fetchByUserResult();
  // }, []);

  return (
    <>
      <ResultSection>
        <Header>
          <Title fontSize="80px" marginBottom="20px">
            감사합니다!
          </Title>
          <SubTitle fontSize="30px" marginBottom="20px">
            결과는 다음과 같아요
          </SubTitle>
        </Header>
        <ResultWindowSection>
          {tendencyResult?.user_answers.map((item, i) => {
            return <Card key={i}>{item.answer.description}</Card>;
          })}
        </ResultWindowSection>
        <SubmitSection>
          <SubmitBtn mode="submit" onClick={handleClose}>
            완료
          </SubmitBtn>
        </SubmitSection>
      </ResultSection>
    </>
  );
};

export default setResultSection;

const ResultSection = styled.div`
  padding: calc(100px / 2) 70px;
`;

const Header = styled.div``;

const Title = styled.h1<ITitle>`
  font-size: ${({ fontSize }) => fontSize};
  margin-bottom: ${({ marginBottom }) => marginBottom};
  text-align: start;
`;

const SubTitle = styled.h1<ITitle>`
  font-size: ${({ fontSize }) => fontSize};
  font-weight: ${({ theme }) => theme.weightBold};
  text-align: start;
  margin-bottom: ${({ marginBottom }) => marginBottom};
`;

const ResultWindowSection = styled.div`
  background: '#2DE466';
  padding: 10px 20px;
  border-radius: 30px;
`;

const SubmitSection = styled.div`
  ${({ theme }) => theme.flexMixIn('end', 'center')}
`;

const SubmitBtn = styled.button<{ mode: string }>`
  width: 4rem;
  height: 2.5rem;
  background-color: ${({ theme }) => theme.mainGreen};
  color: white;
  margin-left: 10px;
  border: none;
  border-radius: 10px;
  font-size: ${({ theme }) => theme.fontSemiMedium};
  font-family: 'Jua', sans-serif;
  cursor: pointer;
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
`;
