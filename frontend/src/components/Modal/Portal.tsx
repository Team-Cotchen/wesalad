import { ReactNode } from 'react';
import reactDom from 'react-dom';

export interface PortalProps {
  children?: ReactNode;
}

const Portal = ({ children }: PortalProps) => {
  const rootElement = document.getElementById('modal') as HTMLElement;
  return reactDom.createPortal(children, rootElement);
};

export default Portal;
