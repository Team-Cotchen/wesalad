import React, { useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import Filter from '../Filter';
import { Switch } from 'antd';
import API from 'config';

import {
  FundProjectionScreenOutlined,
  CheckCircleOutlined,
  BookOutlined,
} from '@ant-design/icons';
import { DetailModel } from 'types/detailmodel';
import { devices } from 'styles/devices';
import Card from '../Card';
import axios from 'axios';
import useIntersect from 'hooks/useIntersectionObserver';

const CATEGORY = [
  {
    name: '모두보기',
    icon: <CheckCircleOutlined />,
    queryKey: 'category',
    queryValue: 0,
  },
  {
    name: '프로젝트',
    icon: <FundProjectionScreenOutlined />,
    queryKey: 'category',
    queryValue: 2,
  },
  {
    name: '스터디',
    icon: <BookOutlined />,
    queryKey: 'category',
    queryValue: 1,
  },
];

const AllCards = () => {
  const [filteredCards, setFilteredCards] = useState<DetailModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pageNum, setPageNum] = useState(1);
  const [queryStringList, setQueryStringList] = useState<string[]>([]);
  const endRef = useRef(false);
  const [category, setCategory] = useState(0);
  const [active, setActive] = useState(false);

  const filterQuery = queryStringList.join('&');
  const categoryQuery = category !== 0 ? `&category=${category}` : '';
  const statusQuery = active === true ? `&status=1` : '';

  const getFilteredCards = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `${API.getPosts}?${filterQuery}${categoryQuery}${statusQuery}`,
      );
      if (!data.next) {
        endRef.current = true;
      }
      setFilteredCards(data.results);
      setIsLoading(false);
    } catch (error) {
      console.error();
    }
  };

  const getMoreCards = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `${API.getPosts}?page=${pageNum}&${filterQuery}${categoryQuery}${statusQuery}`,
      );
      if (!data.next) {
        endRef.current = true;
      }
      setFilteredCards((prev) => [...prev, ...data.results]);
      setIsLoading(false);
    } catch (error) {
      console.error();
    }
  };

  const makeQueryString = (queryKey: string, queryValue: number) => {
    const queryString = `${queryKey}=${queryValue}`;

    if (queryKey === 'all') {
      setPageNum(1);
      setQueryStringList([]);
      return;
    }
    if (queryStringList.includes(queryString)) {
      setQueryStringList(
        queryStringList.filter((item) => item !== queryString),
      );
      return;
    }
    setQueryStringList([...queryStringList, queryString]);
  };

  const handleCategoryClick = (queryKey: string, queryValue: number) => {
    setCategory(queryValue);
    setPageNum(1);
    endRef.current = false;
  };

  const handleSwitchClick = () => {
    setActive(!active);
    setPageNum(1);
    endRef.current = false;
  };

  const reset = () => {
    setQueryStringList([]);
    setPageNum(1);
    endRef.current = false;
  };

  useEffect(() => {
    !isLoading && !endRef.current && pageNum > 1 && getMoreCards();
  }, [pageNum]);

  useEffect(() => {
    getFilteredCards();
  }, [filterQuery, categoryQuery, statusQuery]);

  const ref = useIntersect(
    () => !isLoading && !endRef.current && setPageNum((prev) => prev + 1),
  );

  return (
    <CardSectionWrap>
      <Head>
        <Description>나에게 꼭 맞는 샐러드 찾아볼까요?</Description>
        <HighlightLabel>내 취향에 맞는 샐러드 고르기</HighlightLabel>
      </Head>
      <Filter makeQueryString={makeQueryString} reset={reset} />
      <Options>
        <CategoryWrap>
          {CATEGORY.map(({ name, icon, queryKey, queryValue }, index) => (
            <CategoryOption
              key={index}
              onClick={() => handleCategoryClick(queryKey, queryValue)}
              selected={category === queryValue}
            >
              <div>{icon}</div>
              <span>{name}</span>
            </CategoryOption>
          ))}
        </CategoryWrap>
        <SwitchWrap>
          <span>모집 중만 보기</span>
          <Switch
            style={{
              backgroundColor: '#693bfb',
              position: 'relative',
              bottom: 2,
            }}
            onChange={() => {
              handleSwitchClick();
            }}
          ></Switch>
        </SwitchWrap>
      </Options>
      <Cards>
        <CardWrapper>
          {filteredCards.map((item, index) => (
            <Card
              key={`filter-${index}`}
              cardtype="regular"
              {...item}
              id={item.id}
            />
          ))}
        </CardWrapper>
      </Cards>
      <IntersectLine ref={ref} />
    </CardSectionWrap>
  );
};

export default AllCards;

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

const CardWrapper = styled.div`
  width: 1200px;
  margin-top: 15px;
  display: flex;
  flex-wrap: wrap;
  font-family: ‘Black Han Sans’, sans-serif;
  overflow: hidden;
  margin: 0 auto;
  align-items: center;
  justify-content: center;
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.fontSmall};
  padding-top: 5px;
  padding-left: 3px;
  letter-spacing: 3px;
`;

const SwitchWrap = styled.div`
  display: flex;
  align-items: center;

  span {
    margin-right: 10px;
  }

  @media ${devices.laptop} {
    text-align: center;
  }
`;

const Cards = styled.div`
  display: flex;
  margin-top: 30px;
`;

const Options = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 530px;
  font-size: 24px;
  margin-top: 30px;

  @media ${devices.laptop} {
    flex-direction: column;
    gap: 15px;
  }

  @media ${devices.mobile} {
    font-size: 16px;
  }
`;

const CategoryWrap = styled.div`
  display: flex;
  gap: 5px;
`;

const CategoryOption = styled.div<{ selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  border-radius: 100px;
  padding: 8px 20px;

  ${({ selected }) =>
    selected &&
    css`
      background-color: #693bfb;
      color: white;
    `}

  &:hover {
    background-color: #693bfb;
    color: white;
  }
`;

const IntersectLine = styled.div`
  width: 100%;
  height: 40px;
`;
