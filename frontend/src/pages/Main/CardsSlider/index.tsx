import React from 'react';
import styled from 'styled-components';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Card from 'pages/Main/Card';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { devices } from 'styles/devices';

const CardsSlider = ({ data }: any) => {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    nextArrow: (
      <NextArrowWrap>
        <IoIosArrowForward />
      </NextArrowWrap>
    ),
    prevArrow: (
      <PrevArrowWrap>
        <IoIosArrowBack />
      </PrevArrowWrap>
    ),
  };

  return (
    <StyledSlider {...sliderSettings}>
      {data.map((item: any) => (
        <Card key={item.id} cardtype="promo" {...item} />
      ))}
    </StyledSlider>
  );
};

export default CardsSlider;

const StyledSlider = styled(Slider)`
  width: 100%;
  position: relative;
  padding: 0 10px;
  display: flex;
  flex-wrap: nowrap;

  @media ${devices.tablet} {
    width: 400px;
  }

  .slick-prev::before,
  .slick-next::before {
    opacity: 1;
    display: none;
  }

  .slick-list {
    margin: auto;
    width: 90%;
  }

  .slick-slider {
    display: flex;
  }
  .slick-track {
    display: flex;
    height: 100%;
  }
  .slick-dots {
    display: flex;
  }
  .slick-arrow {
    cursor: pointer;
    font-size: 100px;
  }
`;

const NextArrowWrap = styled.div`
  position: absolute;
  z-index: 2;
  top: 42%;
  color: lightgray;
  right: 50px;

  display: block;
`;

const PrevArrowWrap = styled.div`
  position: absolute;
  top: 42%;
  left: 30px;
  z-index: 2;
  color: lightgray;
  transform: translateY(-50%);
`;
