import React from 'react';
import styled from 'styled-components';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Card from 'pages/Main/Card';

const CardsSlider = ({ data }: any) => {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: true,
    autoplay: false,
    autoplaySpeed: 2000,
    centerMode: true,
    variableWidth: true,
    centerPadding: '0px',
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
  position: relative;
  margin-top: 30px;
  width: 100%;

  .slick-slider {
    display: flex;
  }
  .slick-track {
    display: flex;
    height: 100%;
  }
  .slick-dots {
    display: none !important;
  }
  .slick-arrow {
    color: pink;
    width: 30px;
  }
  .slick-prev {
    position: absolute;
    top: 20px;
  }
  .slick-next {
    position: absolute;
    top: 20px;
    left: 40px;
  }
`;
