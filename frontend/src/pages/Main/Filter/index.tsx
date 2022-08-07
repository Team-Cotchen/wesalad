import React, { FunctionComponent, useEffect, useState } from 'react';
import styled from 'styled-components';
import StackFilter from './StackFilter';

interface IFilter {
  changeQueryStringList: (queryKey: string, queryValue: number) => void;
}

const Filter: FunctionComponent<IFilter> = ({ changeQueryStringList }) => {
  const [isClicked, setIsClicked] = useState('모두 보기');
  const [chosenStackList, setChosenStackList] = useState<string[]>([]);

  useEffect(() => {
    setIsClicked('모두 보기');
  }, []);

  const handleFilterClick = (
    name: string,
    queryKey: string,
    queryValue: number,
  ) => {
    setIsClicked(name);
    if (queryKey === 'stack') {
      return;
    } else if (queryKey === 'all') {
      setChosenStackList([]);
    }
    changeQueryStringList(queryKey, queryValue);
  };

  const handleStackClick = (id: number, value: string) => {
    changeQueryStringList('stack', id);
    if (chosenStackList.includes(value)) {
      setChosenStackList(chosenStackList.filter((stack) => stack !== value));
    } else {
      setChosenStackList([...chosenStackList, value]);
    }
  };

  return (
    <>
      <FilterWrapper>
        {FILTER_LIST.map(({ id, name, queryKey, queryValue }) => (
          <FilterBtn
            onClick={() => handleFilterClick(name, queryKey, queryValue)}
            key={id}
            isChosen={isClicked === name}
          >
            {name}
          </FilterBtn>
        ))}
      </FilterWrapper>
      <FilterDivLine />
      {(isClicked === '프론트엔드' ||
        isClicked === '백엔드' ||
        isClicked === '기타') && (
        <StackFilter
          isClicked={isClicked}
          handleStackClick={handleStackClick}
          chosenStackList={chosenStackList}
        />
      )}
    </>
  );
};

export default Filter;

interface IFilterBtn {
  isChosen: boolean;
}

const FilterWrapper = styled.ul`
  margin: 30px 0;
`;

const FilterBtn = styled.li<IFilterBtn>`
  display: inline-block;
  margin-right: 10px;
  padding: 15px 25px;
  border-radius: 5px;
  background-color: white;
  border: 1px solid ${({ theme }) => theme.mainGreen};
  font-size: ${({ theme }) => theme.fontSemiMedium};
  cursor: pointer;
  background-color: ${({ isChosen }) => (isChosen ? '#2de466' : '')};

  &:hover {
    background-color: ${({ theme }) => theme.mainGreen};
    color: black;
  }
`;

const FilterDivLine = styled.div`
  border: 1px solid #d0d0d0;
  margin-bottom: 30px;
`;

const FILTER_LIST = [
  { id: 0, name: '모두 보기', queryKey: 'all', queryValue: 0 },
  { id: 2, name: '매운맛', queryKey: 'flavor', queryValue: 3 },
  { id: 3, name: '중간맛', queryKey: 'flavor', queryValue: 2 },
  { id: 4, name: '순한맛', queryKey: 'flavor', queryValue: 1 },
  { id: 5, name: '프론트엔드', queryKey: 'stack', queryValue: 0 },
  { id: 6, name: '백엔드', queryKey: 'stack', queryValue: 0 },
  { id: 7, name: '기타', queryKey: 'stack', queryValue: 0 },
];
