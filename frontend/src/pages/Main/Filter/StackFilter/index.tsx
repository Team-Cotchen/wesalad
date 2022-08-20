import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

interface IStackFilter {
  handleStackClick: (id: number, value: string) => void;
  chosenStackList: string[];
  isClicked: string;
}

const StackFilter: FunctionComponent<IStackFilter> = ({
  handleStackClick,
  chosenStackList,
  isClicked,
}: IStackFilter) => {
  const [stackList, setStackList] = useState<
    { id: number; value: string }[] | null
  >(null);

  useEffect(() => {
    if (isClicked === '프론트엔드') {
      setStackList(FRONT_STACK_LIST);
    } else if (isClicked === '백엔드') {
      setStackList(BACK_STACK_LIST);
    } else setStackList(COMMON_STACK_LIST);
  }, [isClicked]);

  return (
    <>
      <FilterOptions>
        {stackList &&
          stackList.map(({ id, value }) => (
            <FilterOption
              onClick={() => handleStackClick(id, value)}
              key={id}
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
  font-family: ‘Black Han Sans’, sans-serif;
  ${({ theme }) => theme.flexMixIn('center', 'center')}
  flex-wrap: wrap;
`;

const FilterOption = styled.div<IFilterOptionProps>`
  margin: 0 20px 40px 0;
  border: 2px solid ${({ isChosen }) => (isChosen ? '#474747' : '#d0d0d0')};
  border-radius: 30px;
  padding: 15px 20px;
  font-size: ${({ theme }) => theme.fontRegular};
  opacity: ${({ isChosen }) => (isChosen ? 1 : 0.3)};
  background-color: ${({ isChosen }) => (isChosen ? '#e8e8e8' : '#ffffff')};
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
