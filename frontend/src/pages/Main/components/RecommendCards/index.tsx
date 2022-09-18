import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import CardCarousel from './Carousel';
import { DetailModel } from 'types/detailmodel';
import API, { getToken } from 'config';
import axios from 'axios';
import { devices } from 'styles/devices';

interface IRecommendedCardsProps {
  openModal: () => void;
}

const RecommendedCards = ({ openModal }: IRecommendedCardsProps) => {
  const [recommendCards, setRecommendCards] = useState<DetailModel[]>([]);
  const { id } = getToken();

  const getRecommendationData = async () => {
    try {
      const query = id ? `?user=${id}` : '';
      const { data } = await axios.get(`${API.getPosts}${query}`);
      setRecommendCards(data.results);
    } catch (error) {
      console.error();
    }
  };

  useEffect(() => {
    getRecommendationData();
  }, []);

  return (
    <CardSectionWrap>
      <Head>
        <Description>위샐러드 추천하는 나에게 맞는 프로젝트</Description>
        <HighlightLabel>이런 프로젝트가 잘 맞으실 것 같아요!</HighlightLabel>
      </Head>
      {id ? (
        <>
          <Notify>PC로 확인 부탁드려요🫶🏻</Notify>
          <RecommendCardWrapper>
            <CardCarousel recommendCards={recommendCards} />
          </RecommendCardWrapper>
        </>
      ) : (
        <NotUserWrap>
          <NotUserText>아직 등록된 성향이 없네요!</NotUserText>
          <NotUserButton onClick={openModal}>
            먼저 내 성향을 알아볼까요?
          </NotUserButton>
        </NotUserWrap>
      )}
    </CardSectionWrap>
  );
};

export default RecommendedCards;

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

const Description = styled.p`
  font-size: ${({ theme }) => theme.fontSmall};
  padding-top: 5px;
  padding-left: 3px;
  letter-spacing: 3px;
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
