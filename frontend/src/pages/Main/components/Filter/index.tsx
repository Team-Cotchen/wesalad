import React, {
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import styled, { css } from 'styled-components';
import { devices } from 'styles/devices';
import StackFilter from './StackFilter';

import { FaPepperHot } from 'react-icons/fa';
import { FiMonitor, FiServer } from 'react-icons/fi';
import { MdPeopleOutline } from 'react-icons/md';
import { BsGlobe } from 'react-icons/bs';

interface IFilterProps {
  makeQueryString: (queryKey: string, queryValue: number) => void;
  reset: () => void;
}

const Filter: FunctionComponent<IFilterProps> = ({
  makeQueryString,
  reset,
}) => {
  const [isClicked, setIsClicked] = useState('모두 보기');
  const [category, setCategory] = useState('');

  const handleFilterBtnClick = (queryKey: string, name: string) => {
    reset();
    setCategory(queryKey);
    setIsClicked(name);
  };

  return (
    <Container>
      <FilterWrapper>
        {FILTER_LIST.map(({ id, name, icon, queryKey }) => (
          <FilterBtn
            onClick={() => {
              handleFilterBtnClick(queryKey, name);
            }}
            key={id}
            isChosen={isClicked === name}
          >
            <span>{icon}</span>
            <span>{name}</span>
          </FilterBtn>
        ))}
      </FilterWrapper>
      {isClicked !== '모두 보기' && (
        <StackFilter
          isClicked={isClicked}
          makeQueryString={makeQueryString}
          category={category}
        />
      )}
      <FilterDivLine />
    </Container>
  );
};

export default Filter;

interface IFilterBtn {
  isChosen: boolean;
}

const Container = styled.div`
  margin-left: 100px;

  @media ${devices.tablet} {
    display: none;
  }
`;

const FilterWrapper = styled.ul`
  margin: 30px;
  ${({ theme }) => theme.flexMixIn('', 'center')}
`;

const FilterBtn = styled.li<IFilterBtn>`
  display: flex;
  align-items: center;
  width: 170px;
  text-align: center;
  display: inline-block;
  margin-right: 10px;
  padding: 15px 15px;
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

  span:first-child {
    margin-right: 10px;
    position: relative;
    top: 3px;
  }
`;

const FilterDivLine = styled.div`
  margin-left: 70px;

  width: 80%;
  border: 1px solid #d0d0d0;
  margin-bottom: 30px;
`;

const FILTER_LIST = [
  { id: 0, name: '모두 보기', queryKey: 'all', icon: <BsGlobe /> },
  { id: 1, name: '맵기', queryKey: 'flavor', icon: <FaPepperHot /> },

  { id: 2, name: '프론트엔드', queryKey: 'stack', icon: <FiMonitor /> },
  { id: 3, name: '백엔드', queryKey: 'stack', icon: <FiServer /> },
  {
    id: 4,
    name: '기타',
    queryKey: 'stack',
    icon: <MdPeopleOutline />,
  },
];
