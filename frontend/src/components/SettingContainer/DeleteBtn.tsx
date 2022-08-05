import React from 'react';
import styled from 'styled-components';

interface IDeleteBtn {
  onClose: () => void;
  onDelete: () => void;
}

const DeleteBtn = ({ onClose, onDelete }: IDeleteBtn) => {
  return (
    <Wrapper>
      <h2>계정을 삭제하시겠어요?</h2>
      <ButtonContainer>
        <button onClick={onClose} className="noBtn">
          아니요
        </button>
        <button onClick={onDelete} className="yesBtn">
          네, 삭제할래요
        </button>
      </ButtonContainer>
    </Wrapper>
  );
};

export default DeleteBtn;

const Wrapper = styled.div`
  width: 20rem;
  background-color: #fff;
  ${({ theme }) => theme.flexMixIn('center', 'center')}
  flex-direction: column;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 3%;
  padding: 2rem 0;
`;

const ButtonContainer = styled.div`
  button {
    border: none;
    margin: 0 10px;
    font-size: ${({ theme }) => theme.fontRegular};
    border-radius: 5%;
    cursor: pointer;
    padding: 5px 10px;
  }

  .yesBtn {
    background-color: #ff3217;
    color: #fff;
  }
`;
