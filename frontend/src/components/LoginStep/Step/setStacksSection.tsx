import React from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'redux/store';
import { nextStep } from 'redux/reducers/loginSlice';
import { Select } from 'antd';
import { ITitle, IInfoSection } from 'components/LoginStep/loginStep.types';

import { OptionModel } from 'components/PostForm/PostForm.model';
import 'antd/dist/antd.less';
const { Option } = Select;
import BackButton from 'components/BackButton';
import { OPTIONS } from 'assets/data/Options.constant';
import { devices } from 'styles/devices';

type IStacks = Pick<OptionModel, 'STACKS'>;

const setStacksSection = ({
  handleBasicInfo,
  name,
}: Pick<IInfoSection, 'handleBasicInfo' | 'name'>) => {
  const dispatch = useDispatch();
  const loginStep = useSelector((state: RootState) => state.login.currentStep);
  const { STACKS }: IStacks = OPTIONS;

  return (
    <>
      <StacksSection>
        <BackButton />
        <Header>
          <Title fontSize="2rem" marginBottom="8px">
            {name}님, 궁금한게 있어요.
          </Title>
          <Title fontSize="2rem" marginBottom="20px">
            언어, 프레임워크를 선택해주세요!
          </Title>
          <SubTitle fontSize="1.2rem" marginBottom="0px">
            관심 태그를 기반으로 소식을 추천해드려요.
          </SubTitle>
        </Header>
        <TechSelectSection>
          <StyledSelect
            placeholder="사용할 기술 스택을 골라주세요."
            bordered={false}
            mode="multiple"
            maxTagCount="responsive"
            showArrow
            onChange={(value) => handleBasicInfo(value as string, 'stacks')}
          >
            {STACKS.map(({ title }, i) => (
              <Option key={i} value={title}>
                {title}
              </Option>
            ))}
          </StyledSelect>
        </TechSelectSection>
        <SubmitSection>
          <SubmitBtn
            onClick={() => {
              dispatch(nextStep(loginStep));
            }}
          >
            다음
          </SubmitBtn>
        </SubmitSection>
      </StacksSection>
    </>
  );
};

export default setStacksSection;

const StacksSection = styled.div`
  padding: 2.5rem 4rem;
`;

const Header = styled.div`
  margin-top: 3rem;
`;

const Title = styled.h1<ITitle>`
  font-size: ${({ fontSize }) => fontSize};
  margin-bottom: ${({ marginBottom }) => marginBottom};
  text-align: center;

  @media ${devices.laptop} {
    font-size: ${({ theme }) => theme.fontMedium};
  }

  @media ${devices.tablet} {
    font-size: ${({ theme }) => theme.fontSemiMedium};
  }
`;

const SubTitle = styled.h1<ITitle>`
  font-size: ${({ fontSize }) => fontSize};
  font-weight: ${({ theme }) => theme.weightBold};
  color: #d3cece;
  text-align: center;
  margin: 0px 10px 5px 0px;

  @media ${devices.tablet} {
    font-size: ${({ theme }) => theme.fontSmall};
    margin-bottom: 10px;
  }
`;

const TechSelectSection = styled.div`
  padding: 10px 70px 0px 70px;

  @media ${devices.laptop} {
    padding: 0px 20px;
  }
`;

const StyledSelect = styled(Select)`
  padding: 10px 10px;
  width: 100%;
  border: 1px transparent solid;
  border-radius: 3px;
  background-color: #f4f5f7;
  cursor: pointer;
`;

const SubmitSection = styled.div`
  margin-top: 50px;
  ${({ theme }) => theme.flexMixIn('end', 'center')}
`;

const SubmitBtn = styled.button`
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
