import React, { useState } from 'react';
import styled from 'styled-components';

import Card from 'pages/Main/components/Card';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

const CardCarousel = ({ recommendCards }: any) => {
  const [counter, setCounter] = useState(0);
  const handleLeftBtnClick = () => {
    setCounter(counter - 1);
  };

  const handleRightBtnClick = () => {
    setCounter(counter + 1);
  };

  return (
    <Container>
      <ScrollWrapper>
        <Cards style={{ transform: `translateX(-${30 * counter}%)` }}>
          {recommendCards.map((item: any) => (
            <Card key={item.id} cardtype="promo" {...item} />
          ))}
        </Cards>
        {counter > 0 && (
          <LeftBtn onClick={handleLeftBtnClick}>
            <IoIosArrowBack style={{ fontSize: 30, color: '#ffffff' }} />
          </LeftBtn>
        )}
        {counter !== recommendCards.length - 3 && recommendCards.length > 3 && (
          <RightBtn onClick={handleRightBtnClick}>
            <IoIosArrowForward style={{ fontSize: 30, color: '#ffffff' }} />
          </RightBtn>
        )}
      </ScrollWrapper>
    </Container>
  );
};
export default CardCarousel;

const Container = styled.div`
  width: 100%;
  position: relative;
`;

const ScrollWrapper = styled.div`
  margin: 0 90px 0 70px;
  padding-top: 20px;
  width: 85%;
  overflow: hidden;
`;

const Cards = styled.div`
  height: 530px;
  transition: 0.4s ease-in-out;
  display: flex;
`;

const LeftBtn = styled.div`
  width: 30px;
  height: 30px;
  background-color: black;
  border-radius: 10px;
  text-align: center;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 40px;
  border: transparent;
`;

const RightBtn = styled.div`
  width: 30px;
  height: 30px;
  background-color: black;
  border-radius: 10px;
  text-align: center;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 40px;
`;
