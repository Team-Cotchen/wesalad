import React, { useState } from 'react';
import styled from 'styled-components';
import LoginSection from 'components/LoginStep/Step/setLoginSection';
import InfoSection from 'components/LoginStep/Step/setInfoSection';
import StacksSection from 'components/LoginStep/Step/setStacksSection';
import QuestionSection from 'components/LoginStep/Step/setQuestionSection';
import ResultSection from 'components/LoginStep/Step/setResultSection';
import { QuestionData } from 'assets/data/QuestionData';
import { ModalProps, IBasicInfo } from 'components/LoginStep/loginStep.types';
import { useSelector, useDispatch } from 'react-redux';
import { nextStep } from 'redux/reducers/loginSlice';
import { RootState } from 'redux/store';
import 'antd/dist/antd.less';
import { message } from 'antd';
import { devices } from 'styles/devices';

const SOCIAL_LOGIN = 1;
const SET_JOININFO = 2;
const SET_INTEREST = 3;
const SET_QUESTION = 4;
const SET_RESULT = 5;

enum BasicInfoKeys {
  name = 'name',
  ordinal_number = 'ordinal_number',
}

const LoginModal = ({ handleClose }: ModalProps) => {
  const dispatch = useDispatch();
  const loginStep = useSelector((state: RootState) => state.login.currentStep);
  const [questionNum, setQuestionNum] = useState<number>(0);
  const [basicInfo, setBasicInfo] = useState<IBasicInfo>({
    name: '',
    ordinal_number: 0,
    answers: '',
    stacks: '',
  });

  const handleBasicInfo = (value: string | unknown, name: string) => {
    setBasicInfo({ ...basicInfo, [name]: value });
  };

  const handleBtnNum = (num: number, name: string) => {
    setBasicInfo({ ...basicInfo, [name]: [...basicInfo.answers, num] });

    if (QuestionData.length !== questionNum + 1) {
      setQuestionNum(questionNum + 1);
    } else {
      dispatch(nextStep(loginStep));
    }
  };

  const handleLoginStep = () => {
    if (basicInfo[BasicInfoKeys.name] === '') {
      message.warning('이름을 적어주세요.');
      return;
    } else if (basicInfo[BasicInfoKeys.name].length > 10) {
      message.warning('이름의 최대길이는 10글자 입니다.');
      return;
    }

    if (basicInfo[BasicInfoKeys.ordinal_number] <= 0) {
      message.warning('기수를 숫자로 입력해주세요.');
      return;
    }

    dispatch(nextStep(loginStep));
  };

  const renderByLoginStep = (loginStep: number) => {
    switch (loginStep) {
      case SOCIAL_LOGIN:
        return <LoginSection />;
      case SET_JOININFO:
        return (
          <InfoSection
            {...{
              handleBasicInfo,
              handleLoginStep,
            }}
          ></InfoSection>
        );
      case SET_INTEREST:
        return <StacksSection name={basicInfo.name} {...{ handleBasicInfo }} />;
      case SET_QUESTION:
        return <QuestionSection {...{ questionNum, handleBtnNum }} />;
      case SET_RESULT:
        return <ResultSection {...{ handleClose, basicInfo }} />;

      default:
        return <div></div>;
    }
  };

  return <Wrapper>{renderByLoginStep(loginStep)}</Wrapper>;
};

export default LoginModal;

const Wrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 42rem;
  height: 30rem;
  border-radius: 5px;
  background-color: white;
  transform: translate(-50%, -50%);

  @media ${devices.laptop} {
    width: 32rem;
  }

  @media ${devices.tablet} {
    width: 28rem;
  }

  @media ${devices.mobile} {
    width: 25rem;
  }
`;
