import React from 'react';
import styled from 'styled-components';
import logo from 'assets/images/logo.png';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setModalVisible } from 'redux/reducers/loginSlice';
import { RootState } from 'redux/store';
import Modal from 'components/Modal/Modal';
import LoginModal from 'components/LoginStep/LoginModal';
import LoginUser from 'components/Nav/LoginUser';

const Nav = () => {
  const isGetToken = window.localStorage.getItem('accessToken') === null;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const modalVisible = useSelector(
    (state: RootState) => state.login.modalVisible,
  );

  const openModal = () => {
    document.body.style.overflow = 'hidden';
    dispatch(setModalVisible(true));
  };

  const closeModal = () => {
    document.body.style.overflow = 'auto';
    dispatch(setModalVisible(false));
  };

  const checkIfLoggedIn = () => {
    if (!isGetToken) navigate('/creation');
    else openModal();
  };

  return (
    <Wrapper>
      <NavBox>
        <NavLeft onClick={() => navigate('/')}>
          <LogoImg src={logo} alt="logo" />
          <Logo>wesalad</Logo>
        </NavLeft>
        <NavRight>
          <NewPost onClick={() => checkIfLoggedIn()}>새 글 쓰기</NewPost>
          {!isGetToken ? (
            <LoginUser />
          ) : (
            <Login onClick={openModal}>로그인</Login>
          )}
        </NavRight>
      </NavBox>
      <Modal name="login" onClose={closeModal} visible={modalVisible}>
        <LoginModal handleClose={closeModal} />
      </Modal>
    </Wrapper>
  );
};

export default Nav;

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 5;
  padding: 15px 0;
  border-bottom: 1px solid #dfe1e6;
  background-color: white;
`;

const NavBox = styled.div`
  ${({ theme }) => theme.flexMixIn('space-between', 'center')}
  padding: 0px 110px;
`;

const NavLeft = styled.div`
  ${({ theme }) => theme.flexMixIn}

  &:hover {
    cursor: pointer;
  }
`;

const LogoImg = styled.img`
  width: 2.6rem;
  height: 2.6rem;
  margin: 0 10px;
`;

const Logo = styled.span`
  display: inline-block;
  font-size: ${({ theme }) => theme.fontMedium};
`;

const NavRight = styled.div`
  ${({ theme }) => theme.flexMixIn('space-between', 'center')}
`;

const NewPost = styled.div`
  margin-right: 15px;
  font-size: ${({ theme }) => theme.fontRegular};

  &:hover {
    cursor: pointer;
  }
`;

const Login = styled.button`
  padding: 7px 20px;
  border-radius: 5px;
  border: 1px solid ${({ theme }) => theme.mainGreen};
  background-color: ${({ theme }) => theme.mainGreen};
  font-size: ${({ theme }) => theme.fontRegular};

  &:hover {
    background-color: white;
    cursor: pointer;
  }
`;
