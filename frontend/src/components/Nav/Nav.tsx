import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import logo from 'assets/images/logo.png';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useRootState } from 'redux/hooks/useRootState';
import { setModalVisible } from 'redux/reducers/loginSlice';
import Modal from 'components/Modal/Modal';
import LoginModal from 'components/LoginStep/LoginModal';
import LoginUser from 'components/Nav/LoginUser';
import { devices } from 'styles/devices';

const Nav = () => {
  const [scroll, setScroll] = useState(false);
  const isGetToken = window.localStorage.getItem('accessToken') === null;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const modalVisible = useRootState((state) => state.login.modalVisible);

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

  useEffect(() => {
    if (typeof window !== undefined) {
      window.addEventListener('scroll', () =>
        setScroll(window.pageYOffset > 170),
      );
    }
  }, []);

  return (
    <Wrapper scroll={scroll}>
      <NavBox scroll={scroll}>
        <NavLeft onClick={() => navigate('/')}>
          <LogoImg src={logo} alt="logo" />
          <Logo>wesalad</Logo>
        </NavLeft>
        <NavRight>
          <NewPost onClick={() => checkIfLoggedIn()}>새 글 쓰기</NewPost>
          {!isGetToken ? (
            <LoginUser />
          ) : (
            <Login scroll={scroll} onClick={openModal}>
              로그인
            </Login>
          )}
        </NavRight>
      </NavBox>

      <Modal onClose={closeModal} visible={modalVisible}>
        <LoginModal handleClose={closeModal} />
      </Modal>
    </Wrapper>
  );
};

export default Nav;

interface IWrapper {
  scroll: boolean;
}

const Wrapper = styled.div<IWrapper>`
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 5;
  padding: 15px 0;
  border-bottom: 1px solid #dfe1e6;
  background-color: ${({ scroll }) => (scroll ? '#693bfb' : '#ffffff')};

  @media screen and ${devices.mobile} {
    padding: 0;
  }
`;

const NavBox = styled.div<IWrapper>`
  ${({ theme }) => theme.flexMixIn('space-between', 'center')}
  padding: 0px 110px;
  color: ${({ scroll }) => (scroll ? '#ffffff' : '#000000')};

  @media screen and ${devices.mobile} {
    padding: 10px;
  }
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
  @media screen and ${devices.mobile} {
    width: 2rem;
    height: 2rem;
  }
`;

const Logo = styled.span`
  display: inline-block;
  font-size: ${({ theme }) => theme.fontMedium};
  @media screen and ${devices.mobile} {
    font-size: ${({ theme }) => theme.fontSemiMedium};
  }
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

  @media screen and ${devices.mobile} {
    font-size: ${({ theme }) => theme.fontSmall};
  }
`;

const Login = styled.button<IWrapper>`
  padding: 7px 20px;
  border-radius: 5px;
  border: 1px solid ${({ theme }) => theme.mainGreen};
  background-color: ${({ theme }) => theme.mainGreen};
  font-size: ${({ theme }) => theme.fontRegular};
  color: black;

  &:hover {
    background-color: white;
    cursor: pointer;
    border: 1px solid ${({ scroll }) => (scroll ? '#000000' : '#2de466')};
  }
`;
