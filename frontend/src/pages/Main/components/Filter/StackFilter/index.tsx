import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

interface IStackFilter {
  isClicked: string;
  category: string;
  makeQueryString: (queryKey: string, queryValue: number) => void;
}

const StackFilter: FunctionComponent<IStackFilter> = ({
  isClicked,
  category,
  makeQueryString,
}: IStackFilter) => {
  const [stackList, setStackList] = useState<
    { id: number; value: string }[] | null
  >(null);
  const [chosenStackList, setChosenStackList] = useState<string[]>([]);

  const handleFilterOptionClick = (value: string, id: number) => {
    if (chosenStackList.includes(value)) {
      setChosenStackList(chosenStackList.filter((el) => el !== value));
      makeQueryString(category, id);
      return;
    }
    setChosenStackList((prev) => [...prev, value]);
    makeQueryString(category, id);
  };

  useEffect(() => {
    setChosenStackList([]);
    if (isClicked === '프론트엔드') {
      setStackList(FRONT_STACK_LIST);
    } else if (isClicked === '백엔드') {
      setStackList(BACK_STACK_LIST);
    } else if (isClicked === '맵기') {
      setStackList(FLAVOR_LIST);
    } else setStackList(COMMON_STACK_LIST);
  }, [isClicked]);

  return (
    <>
      <FilterOptions>
        {stackList &&
          stackList.map(({ id, value }, index) => (
            <FilterOption
              onClick={() => handleFilterOptionClick(value, id)}
              key={`filteroptions-${id}-${value}${index}`}
              isChosen={chosenStackList.includes(value)}
            >
              {value}
            </FilterOption>
          ))}
      </FilterOptions>
    </>
  );
};

export default StackFilter;

interface IFilterOptionProps {
  isChosen: boolean;
}

const FilterOptions = styled.div`
  margin: 0 90px;
  display: flex;
  font-family: ‘Black Han Sans’, sans-serif;
  flex-wrap: wrap;
`;

const FilterOption = styled.div<IFilterOptionProps>`
  margin: 0 20px 40px 0;
  border: 1px solid ${({ isChosen }) => (isChosen ? '#474747' : '#ffffff')};
  border-radius: 30px;
  padding: 8px 15px;
  font-size: ${({ theme }) => theme.fontRegular};
  opacity: ${({ isChosen }) => (isChosen ? 1 : 0.3)};
  background-color: ${({ isChosen }) => (isChosen ? '#e8e8e8' : '#dedede')};
  cursor: pointer;

  &:hover {
    opacity: 1;
    border-color: 1;
  }
`;

const FRONT_STACK_LIST = [
  { id: 1, value: 'Javascript' },
  { id: 2, value: 'Typescript' },
  { id: 3, value: 'React' },
  { id: 4, value: 'Vue' },
  { id: 5, value: 'Svelte' },
  { id: 6, value: 'Nextjs' },
  { id: 7, value: 'Flutter' },
  { id: 8, value: 'ReactNative' },
];

const BACK_STACK_LIST = [
  { id: 9, value: 'Python' },
  { id: 10, value: 'Django' },
  { id: 11, value: 'Nodejs' },
  { id: 12, value: 'Nestjs' },
  { id: 13, value: 'Java' },
  { id: 14, value: 'Spring' },
  { id: 15, value: 'MySQL' },
  { id: 16, value: 'MongoDB' },
];

const COMMON_STACK_LIST = [
  { id: 17, value: 'GraphQL' },
  { id: 18, value: 'AWS' },
  { id: 19, value: 'Kubernetes' },
  { id: 20, value: 'Docker' },
  { id: 21, value: 'Git' },
  { id: 22, value: 'Figma' },
  { id: 23, value: 'Zeplin' },
];

const FLAVOR_LIST = [
  {
    id: 1,
    value: `순한맛 (주 2시간 이하)`,
    queryKey: 'flavor',
  },
  {
    id: 2,
    value: '중간맛 (주 2~4 시간)',
    queryKey: 'flavor',
  },
  {
    id: 3,
    value: '매운맛 (주 4시간 이상)',
    queryKey: 'flavor',
  },
];
