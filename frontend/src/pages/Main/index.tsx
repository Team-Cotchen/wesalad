import React, { FunctionComponent, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import axios from 'axios';
import { Switch } from 'antd';

import Nav from 'components/Nav/Nav';
import MainTypo from 'pages/Main/MainTypo';
import Filter from 'pages/Main/Filter';
import Card from 'pages/Main/Card';

import Modal from 'components/Modal/Modal';
import LoginModal from 'components/LoginStep/LoginModal';

import API, { getToken } from 'config';
import { devices } from 'styles/devices';
import { DetailModel } from 'types/detailmodel';
import CardCarousel from './Carousel';

const LIMIT = 20;

const Main: FunctionComponent = () => {
  const [filteredCards, setFilteredCards] = useState<DetailModel[]>([]);
  const [recommendCards, setRecommendCards] = useState<DetailModel[]>([]);
  const [paginationBtnNumber, setPaginationBtnNumber] = useState(0);
  const [paginationString, setPaginationString] = useState('');
  const [queryStringList, setQueryStringList] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { id } = getToken();

  const { search } = useLocation();
  const navigate = useNavigate();

  const getRecommendationData = async () => {
    try {
      const query = id ? `?user=${id}` : '';
      const { data } = await axios.get(`${API.getPosts}${query}`);
      setRecommendCards(data.results);
    } catch (error) {
      console.error();
    }
  };

  const changeQueryStringList = (queryKey: string, queryValue: number) => {
    const queryString = `${queryKey}=${queryValue}`;
    if (queryKey === 'all') {
      setQueryStringList([]);
      return;
    } else if (queryKey === 'flavor') {
      const stringWithoutFlavor = queryStringList.filter(
        (item) => !item.includes('flavor'),
      );
      const newFlavorString = [...stringWithoutFlavor, queryString];
      setQueryStringList(newFlavorString);
    } else if (queryStringList?.includes(queryString)) {
      setQueryStringList(
        queryStringList?.filter((item) => item !== queryString),
      );
    } else setQueryStringList([...queryStringList, queryString]);
  };

  const changeLocation = () => {
    if (!paginationString) {
      navigate(`?${queryStringList.join('&')}`);
    } else if (!queryStringList) {
      navigate(`?${paginationString}`);
    } else {
      navigate(`?${[paginationString, ...queryStringList].join('&')}`);
    }
  };

  const getFilteredCards = async () => {
    try {
      const { data } = await axios.get(`${API.getPosts}${search || `?page=1`}`);
      setFilteredCards(data.results);
      setPaginationBtnNumber(Math.ceil(data.count / LIMIT));
    } catch (error) {
      console.error();
    }
  };

  const makePagination = (btnNum: number) => {
    const paginationString = `page=${btnNum}`;

    setPaginationString(paginationString);
  };

  const openModal = () => {
    document.body.style.overflow = 'hidden';
    setIsModalOpen(true);
  };

  const closeModal = () => {
    document.body.style.overflow = 'auto';
    setIsModalOpen(false);
  };

  const handleNotUserBtn = () => {
    openModal();
  };

  const handleStatusBtnChange = () => {
    changeQueryStringList('status', 1);
  };

  useEffect(() => {
    getRecommendationData();
  }, []);

  useEffect(() => {
    getFilteredCards();
  }, [search]);

  useEffect(() => {
    changeLocation();
  }, [paginationString, queryStringList]);

  return (
    <>
      <Nav />
      <MainTypo />
      <DivisionLine />
      <CardSectionWrap>
        <Head>
          <Description>위샐러드 추천하는 나에게 맞는 프로젝트</Description>
          <HighlightLabel>이런 프로젝트가 잘 맞으실 것 같아요!</HighlightLabel>
        </Head>
        {!id ? (
          <>
            <Notify>PC로 확인 부탁드려요🫶🏻</Notify>
            <RecommendCardWrapper>
              <CardCarousel recommendCards={recommendCards} />
            </RecommendCardWrapper>
          </>
        ) : (
          <NotUserWrap>
            <NotUserText>아직 등록된 성향이 없네요!</NotUserText>
            <NotUserButton onClick={handleNotUserBtn}>
              먼저 내 성향을 알아볼까요?
            </NotUserButton>
          </NotUserWrap>
        )}
      </CardSectionWrap>
      <DivisionLineTwo />
      <CardSectionWrap>
        <Head>
          <Description>나에게 꼭 맞는 샐러드 찾아볼까요?</Description>
          <HighlightLabel>내 취향에 맞는 샐러드 고르기</HighlightLabel>
        </Head>
        <Filter changeQueryStringList={changeQueryStringList} />
        <SwitchWrap>
          <span>모집 중만 보기</span>
          <Switch
            style={{
              backgroundColor: '#693bfb',
              position: 'relative',
              bottom: 2,
            }}
            onChange={handleStatusBtnChange}
          ></Switch>
        </SwitchWrap>
        <Cards>
          <CardWrapper>
            {filteredCards.map((item) => (
              <Card key={item.id} cardtype="regular" {...item} id={item.id} />
            ))}
          </CardWrapper>
        </Cards>
        <PaginationBtnWrap>
          {[...Array(paginationBtnNumber).keys()].map((item, index) => (
            <PaginationBtn
              onClick={() => makePagination(index + 1)}
              key={index}
            >
              {index + 1}
            </PaginationBtn>
          ))}
        </PaginationBtnWrap>
      </CardSectionWrap>
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
  @media (max-width: 1380px) {
    display: block;
  }
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

const SwitchWrap = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  right: 150px;
  font-size: 20px;

  span {
    margin-right: 10px;
  }

  @media ${devices.laptop} {
    left: 50%;
    width: 50%;
    margin-top: 20px;
  }
`;

const Cards = styled.div`
  display: flex;
  margin-top: 70px;
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
