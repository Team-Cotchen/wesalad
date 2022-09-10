import React from 'react';
import styled from 'styled-components';
import { QuestionData } from 'assets/data/QuestionData';
import {
  IQuestionSection,
  ITitle,
  IProgressBar,
} from 'components/LoginStep/loginStep.types';
import { devices } from 'styles/devices';

const setQuestionSection = ({
  questionNum,
  handleBtnNum,
}: IQuestionSection) => {
  return (
    <>
      <Header>
        <Title fontSize="60px" marginBottom="0px">
          {`Q${QuestionData[questionNum].num}`}
        </Title>
        <SubTitle fontSize="20px" marginBottom="5px">
          {`${QuestionData[questionNum].num}/5`}
        </SubTitle>
        <ProgressBar
          min={0}
          max={100}
          value={(QuestionData[questionNum].id / 5) * 100}
        ></ProgressBar>
        <Question>{QuestionData[questionNum].question}</Question>
      </Header>

      <ChoiceSection>
        <ChoiceBtn onClick={() => handleBtnNum(0, 'answers')}>
          <ICON
            src={`/ingredients/${QuestionData[questionNum].ingredientA}.png`}
          />
          {QuestionData[questionNum].answerA}
        </ChoiceBtn>
        <ChoiceBtn onClick={() => handleBtnNum(1, 'answers')}>
          <ICON
            src={`/ingredients/${QuestionData[questionNum].ingredientB}.png`}
          />
          {QuestionData[questionNum].answerB}
        </ChoiceBtn>
      </ChoiceSection>
    </>
  );
};

export default setQuestionSection;

const Header = styled.div`
  padding: 10px 50px 0px 30px;
`;

const Title = styled.h1<ITitle>`
  font-size: ${({ fontSize }) => fontSize};
  margin-bottom: ${({ marginBottom }) => marginBottom};
  text-align: center;

  @media ${devices.laptop} {
    font-size: 50px;
  }

  @media ${devices.mobile} {
    font-size: 40px;
  }
`;

const SubTitle = styled.h1<ITitle>`
  font-size: ${({ fontSize }) => fontSize};
  font-weight: ${({ theme }) => theme.weightBold};
  color: #d3cece;
  text-align: center;
  margin: 0px 10px 5px 0px;
`;

const ProgressBar = styled.progress<IProgressBar>`
  appearance: none;
  width: 100%;
  height: 30px;
  margin-bottom: 20px;

  &::-webkit-progress-bar {
    background: #ededed;
    border-radius: 30px;
  }

  &::-webkit-progress-value {
    background-color: ${({ theme }) => theme.mainGreen};
    border-radius: 30px;
  }
`;

const Question = styled.h1`
  width: 100%;
  font-size: 25px;
  text-align: center;
  line-height: 40px;

  @media ${devices.laptop} {
    font-size: 19px;
  }

  @media ${devices.tablet} {
    font-size: 16px;
  }

  @media ${devices.mobile} {
    font-size: 14px;
  }
`;

const ChoiceSection = styled.div`
  ${({ theme }) => theme.flexMixIn('center', 'center')};
  flex-direction: column;

  @media ${devices.mobile} {
    padding-top: 10px;
  }
`;

const ChoiceBtn = styled.button`
  background: ${({ theme }) => theme.mainGreen};
  opacity: 0.5;
  width: 75%;
  padding: 22px;
  border: none;
  border-radius: 20px;
  font-size: 22px;
  font-family: 'Jua', sans-serif;
  color: white;
  text-align: center;
  margin: 5px 0px;
  transition: 0.3s ease-in-out;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }

  @media ${devices.laptop} {
    width: 75%;
    font-size: 16px;
    margin-top: 15px;
  }

  @media ${devices.tablet} {
    font-size: 14px;
    margin-top: 10px;
  }

  @media ${devices.mobile} {
    font-size: 12px;
    padding: 15px;
    margin-top: 20px;
  }
`;

const ICON = styled.img`
  margin-right: 8px;
  width: 25px;
  height: 25px;
`;
