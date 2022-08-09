import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import theme from 'styles/theme';
import { devices } from 'styles/devices';

interface CardProps {
  id?: string;
  ingredient?: string;
  name?: string;
  paintCard?: (e: React.MouseEvent<HTMLElement>) => void;
  isAdditional?: boolean;
  isPrimary?: boolean;
  size?: string;
  type?: 'additional' | 'primary' | undefined;
  image_url?: string;
}

const Card: FunctionComponent<CardProps> = ({
  name,
  paintCard,
  isAdditional,
  isPrimary,
  id,
  size,
  type,
  image_url,
}: CardProps) => {
  return (
    <CardWrapper
      onClick={paintCard}
      id={id}
      className="wrapper"
      isAdditional={isAdditional}
      isPrimary={isPrimary}
      size={size}
      type={type}
    >
      <Center>
        <Icon src={image_url} />
        {name}
      </Center>
    </CardWrapper>
  );
};

export default Card;

const CardWrapper = styled.div<{
  isPrimary?: boolean;
  isAdditional?: boolean;
  size?: string;
  type: 'additional' | 'primary' | undefined;
}>`
  display: inline-block;
  flex: 1;
  padding: ${({ size }) => (size === 'small' ? '7px ' : '10px')};
  margin: 10px 10px;

  border: ${({ type }) => {
    const borderStyle = {
      primary: `1px solid #F23D3D`,
      additional: `1px solid ${theme.mainViolet}`,
      default: '1px solid #dbdbdb',
    };

    return borderStyle[type || 'default'];
  }};
  border-radius: 20px;
  background: white;
  cursor: pointer;

  @media screen and ${devices.tablet} {
    font-size: ${theme.fontSmall};
    padding: 6px;
    width: 155px;
  }

  @media screen and ${devices.mobile} {
    width: 146px;
    padding: 5px;
  }
`;

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Icon = styled.img`
  margin-right: 4px;
  width: 21px;
  height: 21px;
`;
