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

const DivisionLine = styled.div`
  width: 2px;
  display: block;
  height: 100px;
  background: linear-gradient(#2de466, #693bfb);
  margin: 50px auto;
`;

const DivisionLineTwo = styled(DivisionLine)`
  background: linear-gradient(#693bfb, #2de466);
`;
