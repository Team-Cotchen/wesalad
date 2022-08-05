import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import { IUserAnswerModi } from 'pages/Setting/Setting';
import { devices } from 'styles/devices';
import { message } from 'antd';

interface ISetAnswerModiProps {
  userAnswerModi: IUserAnswerModi[] | undefined;
  setUserAnswerModi: Dispatch<SetStateAction<IUserAnswerModi[] | undefined>>;
}

const setAnswerModiContainer = ({
  userAnswerModi,
  setUserAnswerModi,
}: ISetAnswerModiProps) => {
  const onAlertMessage = () => {
    message.warning(`수정될 수 있도록 만들고 있어요. 
    조금만 기다려주세요. 🙏`);
  };

  return (
    <>
      <Wrapper>
        <ResultWindowSection>
          {userAnswerModi?.map(({ answers, imageUrl, id }) => (
            <Card onClick={onAlertMessage} key={id}>
              <Icon src={imageUrl}></Icon>
              {answers}
            </Card>
          ))}
        </ResultWindowSection>
      </Wrapper>
    </>
  );
};

export default setAnswerModiContainer;

const Wrapper = styled.div`
  width: 100%;
`;

const ResultWindowSection = styled.div`
  padding: 0px 10px;
  border-radius: 30px;
`;

const Card = styled.li`
  display: inline-block;
  flex: 1;
  padding: 10px;
  margin: 5px;
  background: white;
  font-size: ${({ theme }) => theme.fontSmall};
  border-radius: 20px;
  border: 1px solid #dbdbdb;
  transition: border 0.3s ease-in;

  &:hover {
    border: 1px solid ${({ theme }) => theme.mainViolet};
    cursor: pointer;
  }
`;

const Icon = styled.img`
  margin-right: 4px;
  width: 21px;
  height: 21px;
`;
