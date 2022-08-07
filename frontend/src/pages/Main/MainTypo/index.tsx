import { message } from 'antd';
import React, { FunctionComponent, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { getToken } from 'config';
import { useNavigate } from 'react-router-dom';
import Modal from 'components/Modal/Modal';
import LoginModal from 'components/LoginStep/LoginModal';

const MainTypo: FunctionComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { access, id } = getToken();
  const onAlertMessage = () => {
    message.warning(`수정될 수 있도록 만들고 있어요. 
    조금만 기다려주세요. 🙏`);
  };

  const openModal = () => {
    document.body.style.overflow = 'hidden';
    setIsOpen(true);
  };

  const closeModal = () => {
    document.body.style.overflow = 'auto';
    setIsOpen(false);
  };

  const handleCheckMyCharacter = () => {
    if (access) {
      navigate('/settings');
    } else {
      openModal();
    }
  };

  return (
    <>
      <MainTypoDiv>
        <MainText>
          <Text>FIND</Text>
          <TextTwo>YOUR</TextTwo>
          <TextThree>SALAD</TextThree>
        </MainText>
        <BtnWrapper>
          <FindCharacterBtn onClick={handleCheckMyCharacter}>
            내 협업 성향 알아보기
          </FindCharacterBtn>
          <BoardBtn onClick={() => onAlertMessage}>자랑보드 보러가기</BoardBtn>
        </BtnWrapper>
      </MainTypoDiv>
      <SubTitle>
        <TitleText>
          다양한 재료가 만나 맛있는 샐러드가 만들어지듯이, 서로 다른 사람들이
          만나 특별하고 멋진 프로젝트가 만들어지지요.
        </TitleText>
        <TitleText>
          이번달 인기샐러드 구경하고 내 샐러드 찾으러 가보세요!
        </TitleText>
      </SubTitle>
      <Modal onClose={closeModal} visible={isOpen}>
        <LoginModal handleClose={closeModal} />
      </Modal>
    </>
  );
};

export default MainTypo;

const MainTypoDiv = styled.div`
  margin-top: 120px;
`;

const MainText = styled.div`
  margin-top: 70px;
  ${({ theme }) => theme.flexMixIn}
  flex-direction: column;
`;

const linearAnimationOne = keyframes`

0% {
  background-color: black;
  -webkit-text-fill-color : transparent;
  -webkit-background-clip: text;
}
25%{
  background: linear-gradient(90deg, #2de466, #693bfb);
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
}
50%{
  background-color: black;
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
}
100%{
  background-color: black;
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
}
`;

const linearAnimationTwo = keyframes`
0% {
  background-color: black;
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
}
25%{
  background-color: black;
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;

}
50%{
  background: linear-gradient(90deg, #2de466, #693bfb);
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
}
100%{
  background-color: black;
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
}
`;

const linearAnimationThree = keyframes`
0% {
  background-color: black;
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
}
25%{
  background-color: black;
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;

}
50%{
  background-color: black;
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
}
75%{
  background: linear-gradient(90deg, #2de466, #693bfb);
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
}
`;

const Text = styled.h1`
  font-size: 160px;
  margin: 0 auto;
  font-weight: ${({ theme }) => theme.weightBold};
  letter-spacing: 5px;
  animation: ${linearAnimationOne} 8s infinite;
  line-height: 160px;
`;

const TextTwo = styled(Text)`
  animation: ${linearAnimationTwo} 8s infinite;
`;

const TextThree = styled(Text)`
  animation: ${linearAnimationThree} 8s infinite;
`;

const BtnWrapper = styled.div`
  margin: 60px auto;
  text-align: center;
`;

const FindCharacterBtn = styled.button`
  width: 250px;
  padding: 15px 25px;
  border-radius: 5px;
  background-color: black;
  color: white;
  font-size: ${({ theme }) => theme.fontSemiMedium};
  box-shadow: none;
  border: 1px solid black;
  cursor: pointer;
  &:hover {
    background-color: white;
    color: black;
  }
`;

const BoardBtn = styled(FindCharacterBtn)`
  background-color: white;
  border: 1px solid #c1c0c0;
  color: #5b5b5b;
  box-shadow: none;
  margin-left: 20px;
  &:hover {
    border: 1px solid black;
  }
`;

const SubTitle = styled.div`
  text-align: center;
`;

const TitleText = styled.div`
  color: #b9b9b9;
  font-size: ${({ theme }) => theme.fontSemiMedium};
  line-height: 1.6em;
  background: none;
  ::selection {
    background-color: ${({ theme }) => theme.mainViolet};
  }
`;
