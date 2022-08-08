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
    centerPadding: '10px',
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

  .slick-list {
    width: 1300px;
    margin: auto;
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
    color: black;
    cursor: pointer;
  }
  .slick-prev {
    position: absolute;
    z-index: 100;
    left: 10px;
    background-color: black;
  }
  .slick-next {
    position: absolute;
    z-index: 100;
    right: 0px;
    background-color: black;
  }
`;
