import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

interface StackFilterProps {
  stack: string;
  makeQueryString: (queryKey: string, queryValue: string) => void;
}

const StackFilter = ({ stack, makeQueryString }: StackFilterProps) => {
  const [stackList, setStackList] = useState<
    { id: number; value: string }[] | null
  >(null);
  const [chosenStackList, setChosenStackList] = useState<string[]>([]);

  useEffect(() => {
    if (stack === '프론트엔드') {
      setStackList(FRONT_STACK_LIST);
    } else if (stack === '백엔드') {
      setStackList(BACK_STACK_LIST);
    }
  }, [stack]);

  const handleStackClick = (value: string) => {
    makeQueryString('stack', value);
    chosenStackList.includes(value)
      ? setChosenStackList(chosenStackList.filter((stack) => stack !== value))
      : setChosenStackList([...chosenStackList, value]);
  };

  return (
    <>
      <FilterOptions>
        {stackList &&
          stackList.map(({ id, value }) => (
            <FilterOption
              onClick={() => handleStackClick(value)}
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
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

const FilterOption = styled.div<IFilterOptionProps>`
  margin: 0 20px 10px 0;
  border: 1px solid ${({ isChosen }) => (isChosen ? '#000000' : '#d0d0d0')};
  border-radius: 30px;
  padding: 15px 20px;
  font-size: ${({ theme }) => theme.fontRegular};
  opacity: ${({ isChosen }) => (isChosen ? 1 : 0.3)};
  cursor: pointer;

  &:hover {
    opacity: 1;
    border-color: 1;
  }
`;

const FRONT_STACK_LIST = [
  { id: 0, value: 'Javascript' },
  { id: 1, value: 'Typescript' },
  { id: 2, value: 'React' },
  { id: 3, value: 'Vue' },
  { id: 4, value: 'Node.js' },
  { id: 5, value: 'Spring' },
  { id: 6, value: 'Java' },
  { id: 7, value: 'Next.js' },
  { id: 8, value: 'Express' },
  { id: 9, value: 'Go' },
  { id: 10, value: 'C' },
  { id: 11, value: 'Python' },
  { id: 12, value: 'Django' },
  { id: 13, value: 'Swift' },
  { id: 14, value: 'Kotlin' },
];

const BACK_STACK_LIST = [
  { id: 15, value: 'MySQL' },
  { id: 16, value: 'MongoDB' },
  { id: 17, value: 'PHP' },
  { id: 18, value: 'GraphQL' },
  { id: 19, value: 'Firebase' },
  { id: 20, value: 'ReactNative' },
  { id: 21, value: 'Unity' },
  { id: 22, value: 'Flutter' },
  { id: 23, value: 'AWS' },
  { id: 24, value: 'Kubernetes' },
  { id: 25, value: 'Docker' },
  { id: 26, value: 'Git' },
  { id: 27, value: 'Figma' },
  { id: 28, value: 'Zeplin' },
];
