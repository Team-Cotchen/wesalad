import React from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { clearStep } from 'redux/reducers/loginSlice';
import { message } from 'antd';

const DropdownItem = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    message.success('로그아웃 되었습니다👋');
    dispatch(clearStep());
    localStorage.clear();
    navigate('/');
  };

  return (
    <Wrapper>
      <ul>
        <Link to="/myposts">
          <li>내 작성글</li>
        </Link>
        <Link to="/setting">
          <li>설정</li>
        </Link>
        <li onClick={handleLogout}>로그아웃</li>
      </ul>
    </Wrapper>
  );
};

export default DropdownItem;

const Wrapper = styled.div`
  position: absolute;
  top: 90%;
  right: 9%;
  font-size: ${({ theme }) => theme.fontRegular};
  width: 7rem;
  background: rgba(255, 255, 255);
  box-shadow: 0px 5px 30px rgba(0, 0, 0, 0.15);
  border-radius: 3%;

  ul {
    padding: 10px;
    list-style: none;
    margin: 0;
  }

  a {
    color: black;
  }

  li {
    margin: 0.3rem 0;
    cursor: pointer;
    &:hover {
      color: ${({ theme }) => theme.mainViolet};
    }
  }
`;
