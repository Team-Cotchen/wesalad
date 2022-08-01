import React from 'react';
import styled from 'styled-components';
import { IoIosArrowBack } from 'react-icons/io';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'redux/store';
import { previousStep } from 'redux/reducers/loginSlice';

const BackBtn = () => {
  const loginStep = useSelector((state: RootState) => state.login.currentStep);
  const dispatch = useDispatch();

  const handleToBack = () => {
    dispatch(previousStep(loginStep));
  };
  return (
    <>
      <IconSection>
        <IoIosArrowBack onClick={handleToBack} className="arrow" size={30} />
      </IconSection>
    </>
  );
};

const IconSection = styled.div`
  padding: 10px 20px;

  .arrow {
    position: absolute;
    left: 15px;
    top: 80px;
    cursor: pointer;
  }
`;

export default BackBtn;
