import React, { FunctionComponent, useState } from 'react';
import styled from 'styled-components';
import StackFilter from './StackFilter';

interface FilterProps {
  makeQueryString: (queryKey: string, queryValue: string) => void;
}

const Filter: FunctionComponent<FilterProps> = ({ makeQueryString }) => {
  const [chosenFilter, setChosenFilter] = useState('모두 보기');

  const handleFilterClick = (name: string) => {
    setChosenFilter(name);
    if (name === '위샐러드 추천!') {
      makeQueryString('filter', 'recommendation');
    } else if (name === '중간맛' || name === '순한맛' || name === '매운맛') {
      makeQueryString('flavor', name);
    } else if (name === '모두 보기') {
      makeQueryString('seeAll', 'seeAll');
    }
  };

  return (
    <>
      <FilterWrapper>
        {FILTER_LIST.map(({ id, name }) => (
          <FilterBtn
            onClick={() => handleFilterClick(name)}
            key={id}
            isChosen={chosenFilter === name}
          >
            {name}
          </FilterBtn>
        ))}
      </FilterWrapper>
      <FilterDivLine />
      {(chosenFilter === '프론트엔드' || chosenFilter === '백엔드') && (
        <StackFilter stack={chosenFilter} makeQueryString={makeQueryString} />
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
  { id: 0, name: '모두 보기' },
  { id: 1, name: '위샐러드 추천!' },
  { id: 2, name: '매운맛' },
  { id: 3, name: '중간맛' },
  { id: 4, name: '순한맛' },
  { id: 5, name: '프론트엔드' },
  { id: 6, name: '백엔드' },
];
