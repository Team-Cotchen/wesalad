import Nav from 'components/Nav';
import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { CARDS_DATA } from 'pages/Main/cardsdata';
import MainTypo from 'pages/Main/MainTypo';
import Filter from 'pages/Main/Filter';
import Card from 'pages/Main/Card';
import CardsSlider from './CardsSlider';
import { useNavigate, useLocation } from 'react-router-dom';

const LIMIT = 20;

const Main: FunctionComponent = () => {
  //데이터 받아올 때 담는 변수
  // const [promoCards, setPromoCards] = useState([]);
  const [queryString, setQueryString] = useState('');
  const queryListRef = useRef<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [paginationBtnNumber, setPaginationBtnNumber] = useState(4);
  const [paginationString, setPaginationString] = useState('');

  useEffect(() => {
    (async () => {
      const response = await fetch(
        `http://172.20.10.6:8080/posts?${paginationString}&${queryString}`,
      );
      const data = await response.json();
      console.log(data);
      // setPromoCards(data);
      setPaginationBtnNumber(Math.ceil(data.length / LIMIT));
    })();
  }, [queryString, location.search]);

  const makeQueryString = (queryKey: string, queryValue: string) => {
    const newQueryString = `${queryKey}=${queryValue}`;
    if (queryKey === 'seeAll') {
      setQueryString('');
      return;
    } else if (
      queryKey !== 'stack' &&
      !queryListRef.current.join().includes('stack')
    ) {
      queryListRef.current = [newQueryString];
    } else {
      queryListRef.current.includes(newQueryString)
        ? (queryListRef.current = queryListRef.current.filter(
            (query) => query !== newQueryString,
          ))
        : queryListRef.current.push(newQueryString);
    }
    setQueryString(`${queryListRef.current.join('&')}`);
  };

  const makePagination = (btnNum: number) => {
    const paginationString = `offset=${btnNum * LIMIT}&limit=${LIMIT}`;
    setPaginationString(paginationString);
  };

  return (
    <>
      <Nav />
      <Wrapper>
        <MainTypo />
        <DivisionLine />
        <CardSectionWrap>
          <Head>
            <Description>서두르세요! 한 자리 남았어요!</Description>
            <HighlightLabel>
              비니빈 드레싱만 있으면 완성되는 샐러드!
            </HighlightLabel>
          </Head>
          <CardWrapper>
            <CardsSlider data={CARDS_DATA} />
          </CardWrapper>
        </CardSectionWrap>
        <DivisionLineTwo />
        <CardSectionWrap>
          <Head>
            <Description>나에게 꼭 맞는 샐러드 찾아볼까요?</Description>
            <HighlightLabel>내 취향에 맞는 샐러드 고르기</HighlightLabel>
          </Head>
          <Filter makeQueryString={makeQueryString} />
          <CardWrapper>
            {CARDS_DATA.map((item) => (
              <Card key={item.id} cardtype="regular" {...item} />
            ))}
          </CardWrapper>
          <PaginationBtnWrap>
            {[...Array(paginationBtnNumber).keys()].map((item, index) => (
              <PaginationBtn onClick={() => makePagination(index)} key={index}>
                {index + 1}
              </PaginationBtn>
            ))}
          </PaginationBtnWrap>
        </CardSectionWrap>
      </Wrapper>
    </>
  );
};

export default Main;

const Wrapper = styled.div`
  margin: 65px 100px;
  padding-bottom: 100px;
`;

const DivisionLine = styled.div`
  width: 2px;
  display: block;
  height: 100px;
  background: linear-gradient(#2de466, #693bfb);
  margin: 50px auto;
`;

const CardSectionWrap = styled.div`
  margin: 40px 30px;
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
`;

const CardWrapper = styled.div`
  margin-top: 15px;
  display: flex;
  font-family: ‘Black Han Sans’, sans-serif;
  overflow: hidden;
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 200px;
  margin: 30px auto;
`;

const PaginationBtn = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.mainViolet};
  box-shadow: none;
  outline: none;
  text-decoration: none;
  color: white;
  cursor: pointer;
`;
