import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
const { Option } = Select;
import { Select } from 'antd';
import { OptionModel } from 'components/PostForm/PostForm.model';
import { OPTIONS } from 'assets/data/Options.constant';
type IStacks = Pick<OptionModel, 'STACKS'>;

interface ISetStackModi {
  userStackModi: string[];
  setUserStackModi: Dispatch<SetStateAction<string[]>>;
}

const setStackModi = ({ userStackModi, setUserStackModi }: ISetStackModi) => {
  const { STACKS }: IStacks = OPTIONS;

  return (
    <>
      <StyledSelect
        placeholder="사용할 기술 스택을 골라주세요."
        bordered={false}
        value={userStackModi}
        mode="multiple"
        maxTagCount="responsive"
        showArrow
        onChange={(value) => setUserStackModi(value as any)}
      >
        {STACKS.map(({ title }, i) => (
          <Option key={i} value={title}>
            {title}
          </Option>
        ))}
      </StyledSelect>
    </>
  );
};

export default setStackModi;

const StyledSelect = styled(Select)`
  padding: 10px 10px;
  width: 100%;
  border: 1px transparent solid;
  border-radius: 3px;
  background-color: #f4f5f7;
  cursor: pointer;
`;
