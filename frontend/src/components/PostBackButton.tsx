import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBackOutline } from 'react-icons/io5';
import styled from 'styled-components';

import theme from 'styles/theme';
import { devices } from 'styles/devices';

const PostBackButton = () => {
  const navigate = useNavigate();

  return <BackButton onClick={() => navigate(-1)} />;
};

export default PostBackButton;

const BackButton = styled(IoArrowBackOutline)`
  display: block;
  margin: 0 0 20px 20px;
  font-size: ${theme.fontLarge};
  cursor: pointer;
  background: ${theme.mainGreen};
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: #fff;

  @media screen and ${devices.mobile} {
    font-size: ${theme.fontMedium};
    width: 30px;
    height: 30px;
  }
`;
