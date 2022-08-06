import { message } from 'antd';
import React, {
  FunctionComponent,
  useState,
  Dispatch,
  SetStateAction,
} from 'react';
import styled from 'styled-components';

import Card from 'components/Card';
import { devices } from 'styles/devices';

import theme from 'styles/theme';
import logo from 'assets/images/logo.png';
import { GrFormClose } from 'react-icons/gr';

import { OPTIONS } from 'assets/data/Options.constant';
const { CARD_LIST } = OPTIONS;

interface Props {
  additionalCards: string[];
  primaryCards: string[];
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  setAdditionalCards: Dispatch<SetStateAction<string[]>>;
  setPrimaryCards: Dispatch<SetStateAction<string[]>>;
}

const PostFormModal: FunctionComponent<Props> = ({
  additionalCards,
  primaryCards,
  setAdditionalCards,
  setPrimaryCards,
  setIsModalOpen,
}: Props) => {
  const [currentSelection, setCurrentSelection] = useState<
    'primary' | 'additional'
  >('primary');

  const handleCard = (e: React.MouseEvent<HTMLElement>) => {
    const selectedCard =
      (e.target as Element).closest('.wrapper')?.id || 'card';

    currentSelection === 'primary'
      ? handlePrimary(selectedCard)
      : handleAdditional(selectedCard);
  };

  const handlePrimary = (card: string) => {
    const isPrimary = primaryCards.includes(card);
    const isAdditional = additionalCards.includes(card);
    const requiredChoices = 3;
    const finished = primaryCards.length >= requiredChoices;

    if (!finished) {
      isPrimary
        ? setPrimaryCards(primaryCards.filter((item) => item !== card))
        : setPrimaryCards([...primaryCards, card]);
    }

    if (finished && isPrimary) {
      setPrimaryCards(primaryCards.filter((item) => item !== card));
    }

    if (isAdditional) {
      setAdditionalCards(additionalCards.filter((item) => item !== card));
    }
  };

  const handleAdditional = (card: string) => {
    const isAdditional = additionalCards.includes(card);
    const isPrimary = primaryCards.includes(card);

    !isPrimary &&
      (isAdditional
        ? setAdditionalCards(additionalCards.filter((item) => item !== card))
        : setAdditionalCards([...additionalCards, card]));
  };

  const goToNextSelection = () => {
    const requiredChoices = 3;
    const finished = primaryCards.length >= requiredChoices;

    if (!finished) {
      message.warn('3가지의 메인 카드를 골라주세요.');
      return;
    }

    setCurrentSelection('additional');
  };

  const showSuccessMsg = () => {
    message.success('성향카드들이 선택되었습니다!');
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const getCardType = (card: string) => {
    if (primaryCards.includes(card)) return 'primary';
    else if (
      additionalCards.includes(card) &&
      currentSelection === 'additional'
    )
      return 'additional';
  };

  return (
    <Wrapper>
      <ModalBox>
        <ModalNav>
          <Logo src={logo} alt="logo" />
          Wesalad
          <CloseBtn onClick={closeModal} />
        </ModalNav>
        <Main>
          {currentSelection === 'primary' ? (
            <Label>
              팀 성향을 대표할 수 있는 <span>세 가지</span>의 카드를 골라주세요.
              <Description>
                (해당 카드들은 메인 페이지에 보여집니다.)
              </Description>
            </Label>
          ) : (
            <Label>
              추가로 선택하고 싶은 성향들이 있다면
              <span> 갯수에 제한 없이 </span>
              골라주세요.
              <Description>
                (해당 카드들은 프로젝트 상세 페이지에 보여집니다.)
              </Description>
            </Label>
          )}

          <CardBox>
            {CARD_LIST?.map(({ image_url, name }, index) => (
              <Card
                id={name}
                key={name + index}
                image_url={image_url}
                name={name}
                paintCard={handleCard}
                type={getCardType(name)}
              />
            ))}
          </CardBox>
        </Main>
        <SubmitBtn
          onClick={
            currentSelection === 'primary' ? goToNextSelection : showSuccessMsg
          }
        >
          선택 완료!
        </SubmitBtn>
      </ModalBox>
    </Wrapper>
  );
};

export default PostFormModal;

const Wrapper = styled.div`
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.1);
  z-index: 100;
`;

const ModalBox = styled.div`
  position: relative;
  width: 700px;
  height: 580px;
  background-color: #fff;
  border-radius: 3px;

  @media screen and ${devices.tablet} {
    width: 460px;
  }

  @media screen and ${devices.mobile} {
    width: 435px;
    height: 560px;
  }
`;

const ModalNav = styled.nav`
  position: absolute;
  display: flex;
  align-items: center;
  left: 0;
  top: 0;
  padding: 10px;
  width: 700px;
  height: 50px;
  font-weight: ${theme.weightBold};
  border: 0;
  background-color: #d9d9d9;

  @media screen and ${devices.tablet} {
    width: 460px;
  }

  @media screen and ${devices.mobile} {
    width: 435px;
  }
`;

const Logo = styled.img`
  margin: 0 10px;
  width: 30px;
  height: 30px;
`;

const CloseBtn = styled(GrFormClose)`
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: ${theme.fontMedium};
  cursor: pointer;
`;

const Main = styled.main`
  position: relative;
  margin: 80px 30px 10px 30px;
  height: 530px;
  font-size: ${theme.fontSemiMedium};

  @media screen and ${devices.tablet} {
    font-size: ${theme.fontRegular};
  }

  @media screen and ${devices.mobile} {
    font-size: ${theme.fontSmall};
  }
`;

const Label = styled.label`
  span {
    color: ${theme.mainViolet};
  }
`;

const Description = styled.div`
  margin-top: 10px;
  font-size: ${theme.fontSmall};
  color: #808080;
`;

const CardBox = styled.ul`
  margin-top: 30px;
  border: 1px solid #dbdbdb;
  padding: 20px;
  border-radius: 3px;
`;

const SubmitBtn = styled.button`
  position: absolute;
  padding: 20px;
  bottom: 15px;
  right: 30px;
  line-height: 3px;
  border: 0;
  border-radius: 30px;
  background-color: ${theme.mainViolet};
  color: #fff;
  font-weight: bold;
  font-size: ${theme.fontSmall};
  cursor: pointer;

  @media screen and ${devices.mobile} {
    font-size: 13px;
    padding: 15px;
    bottom: 15px;
  }
`;
