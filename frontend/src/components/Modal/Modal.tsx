import React from 'react';
import styled from 'styled-components';
import Portal from './Portal';
import { PortalProps } from './Portal';

export interface ModalProps extends PortalProps {
  onClose: () => void;
  visible: boolean;
  name?: string;
}

const Modal = ({ name, onClose, visible, children }: ModalProps) => {
  const onMaskClick = (e: React.MouseEvent<HTMLElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <Portal>
      <ModalWrapper onClick={onMaskClick} visible={visible}>
        {children}
      </ModalWrapper>
      <ModalOverlay name={name as string} visible={visible} />
    </Portal>
  );
};

const ModalWrapper = styled.div<{ visible: boolean }>`
  box-sizing: border-box;
  display: ${({ visible }) => (visible ? 'block' : 'none')};
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  outline: 0;
  z-index: 1000;
  overflow: auto;
`;

const ModalOverlay = styled.div<{ name: string; visible: boolean }>`
  box-sizing: border-box;
  display: ${({ visible }) => (visible ? 'block' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(77, 77, 77, 0.5);
  z-index: 900;
`;

export default Modal;
