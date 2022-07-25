import React from 'react';
import styled from 'styled-components';
import BackButton from 'components/BackButton';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import { ITitle } from 'components/LoginStep/loginStep.types';
import { IInfoSection } from 'components/LoginStep/loginStep.types';

const setInfoSection = ({ handleBasicInfo, handleLoginStep }: IInfoSection) => {
  const imageUrl = useSelector((state: RootState) => state.login.imageUrl);

  return (
    <>
      <InfoSection>
        <BackButton />
        <Title fontSize="28px" marginBottom="30px">
          WeSalad에 처음오셨군요!
        </Title>
        <SubTitle fontSize="20px" marginBottom="20px">
          우선, 추가정보를 입력해주세요.
        </SubTitle>
        <UserDetailInfo>
          <Profile alt="profile" src={imageUrl}></Profile>
          <Form>
            <DetailTitle>기수</DetailTitle>
            <input
              type="number"
              onChange={(e) =>
                handleBasicInfo(e.target.value, 'ordinal_number')
              }
            />
            <DetailTitle>이름</DetailTitle>
            <input
              type="text"
              onChange={(e) => handleBasicInfo(e.target.value, 'name')}
            />
          </Form>
        </UserDetailInfo>
        <SubmitSection>
          <SubmitBtn onClick={handleLoginStep}>다음</SubmitBtn>
        </SubmitSection>
      </InfoSection>
    </>
  );
};

export default setInfoSection;

const InfoSection = styled.div`
  padding: calc(92px / 2) 70px;
`;

const Title = styled.h1<ITitle>`
  font-size: ${({ fontSize }) => fontSize};
  margin-bottom: ${({ marginBottom }) => marginBottom};
  text-align: center;
`;

const SubTitle = styled.h1<ITitle>`
  font-size: ${({ fontSize }) => fontSize};
  font-weight: ${({ theme }) => theme.weightBold};
  color: #d3cece;
  text-align: center;
  margin: 0px 10px 5px 0px;
`;

const UserDetailInfo = styled.div`
  ${({ theme }) => theme.flexMixIn('center', 'center')};
  margin-bottom: 70px;
`;

const Profile = styled.img`
  width: 130px;
  height: 130px;
  margin-right: 30px;
  border-radius: 50%;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 10px 0;

  input[type='number']::-webkit-outer-spin-button,
  input[type='number']::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  input {
    height: 40px;
    padding: 0px 10px;
    border: none;
    border-bottom: 3px solid rgba(0, 0, 0, 0.3);
    font-size: 20px;
    line-height: 40px;
    font-family: 'Jua', sans-serif;
  }
`;

const DetailTitle = styled.h1`
  margin-top: 15px;
  font-size: 20px;
`;

const SubmitSection = styled.div`
  margin-top: 30px;
  ${({ theme }) => theme.flexMixIn('end', 'center')}
`;

const SubmitBtn = styled.button`
  width: 4rem;
  height: 2.5rem;
  background-color: ${({ theme }) => theme.mainGreen};
  color: white;
  margin-left: 10px;
  border: none;
  border-radius: 10px;
  font-size: ${({ theme }) => theme.fontSemiMedium};
  font-family: 'Jua', sans-serif;
  cursor: pointer;
`;
