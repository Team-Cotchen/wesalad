import React, { FunctionComponent, useState } from 'react';

import styled from 'styled-components';

import Nav from 'components/Nav/Nav';
import MainTypo from 'pages/Main/components/MainTypo';

import RecommendedCards from './components/RecommendCards';
import AllCards from './components/AllCards';
import Modal from 'components/Modal/Modal';
import LoginModal from 'components/LoginStep/LoginModal';

import { devices } from 'styles/devices';

const Main: FunctionComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    document.body.style.overflow = 'hidden';
    setIsModalOpen(true);
  };

  const closeModal = () => {
    document.body.style.overflow = 'auto';
    setIsModalOpen(false);
  };

  return (
    <>
      <Nav />
      <MainTypo />
      <DivisionLine />
      <RecommendedCards openModal={openModal} />
      <DivisionLineTwo />
      <AllCards />
      <Modal onClose={closeModal} visible={isModalOpen}>
        <LoginModal handleClose={closeModal} />
      </Modal>
    </>
  );
};

export default Main;

const Wrapper = styled.div`
  margin: 0 auto;
  padding-bottom: 100px;

  @media ${devices.laptop} {
    width: 32rem;
  }

  @media ${devices.tablet} {
    width: 28rem;
  }

  @media ${devices.mobile} {
    margin: 0 auto;
    width: 25rem;
  }
`;

const DivisionLine = styled.div`
  width: 2px;
  display: block;
  height: 100px;
  background: linear-gradient(#2de466, #693bfb);
  margin: 50px auto;
`;

const CardSectionWrap = styled.div`
  margin: 30px 0px;
`;

const Head = styled.div`
  text-align: center;
  color: #b9b9b9;
`;

const HighlightLabel = styled.span`
  display: inline-block;
  color: black;
  font-size: 35px;
  line-height: 1.6em;
  margin-top: 10px;
  ::selection {
    background-color: ${({ theme }) => theme.mainGreen};
  }

  @media ${devices.mobile} {
    font-size: 30px;
    margin-top: 0;
  }
`;

const RecommendCardWrapper = styled.div`
  margin-top: 15px;
  display: flex;
  flex-wrap: wrap;
  font-family: ‘Black Han Sans’, sans-serif;
  overflow: hidden;
  margin: 0 auto;
  align-items: center;
  justify-content: center;

  @media (max-width: 1380px) {
    display: none;
  }
`;

const CardWrapper = styled(RecommendCardWrapper)`
  width: 1200px;
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.fontSmall};
  padding-top: 5px;
  padding-left: 3px;
  letter-spacing: 3px;
`;

const DivisionLineTwo = styled(DivisionLine)`
  background: linear-gradient(#693bfb, #2de466);
`;

const PaginationBtnWrap = styled.div`
  ${({ theme }) => theme.flexMixIn('center', 'center')}
  max-width: 200px;
  margin: 30px auto;
  padding-bottom: 40px;
`;

const PaginationBtn = styled.button`
  width: 40px;
  height: 40px;
  margin-right: 15px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.mainViolet};
  outline: none;
  text-decoration: none;
  color: white;
  border: none;
  text-decoration: none;
  line-height: 1;
  text-align: center;
  cursor: pointer;
`;

const NotUserWrap = styled.div`
  border-radius: 5px;
  text-align: center;
  padding: 20px;
  background-color: #e7e7e7;
  width: 500px;
  margin: 0 auto;
  margin-top: 40px;
  @media ${devices.mobile} {
    width: 350px;
  }
`;

const NotUserText = styled.div`
  padding: 10px;
  font-size: ${({ theme }) => theme.fontRegular};
`;

const NotUserButton = styled.button`
  padding: 7px 20px;
  margin-bottom: 20px;
  border-radius: 5px;
  border: 1px solid ${({ theme }) => theme.mainGreen};
  background-color: ${({ theme }) => theme.mainGreen};
  font-size: ${({ theme }) => theme.fontRegular};

  &:hover {
    text-decoration-line: underline;
    cursor: pointer;
  }
`;

const Cards = styled.div`
  display: flex;
  margin-top: 30px;
`;

const Notify = styled.div`
  margin: 20px auto;
  text-align: center;
  font-size: 20px;
  color: #666666;
  border: 1px solid;
  padding: 20px;
  width: 70%;

  @media (min-width: 1380px) {
    display: none;
  }
`;

const Options = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 530px;
  font-size: 24px;
  margin-top: 30px;
`;

const CategoryWrap = styled.div`
  display: flex;
  gap: 5px;
`;

const CategoryOption = styled.div`
  display: flex;
  gap: 8px;
  cursor: pointer;
  border-radius: 100px;
  padding: 8px 20px;

  &:hover {
    background-color: #693bfb;
    color: white;
  }
`;
