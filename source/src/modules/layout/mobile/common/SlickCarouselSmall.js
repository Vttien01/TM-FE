import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ImgButton from './Button';
import arrowRight from '@assets/icons/arowrightbtn.svg';
const SlickCarouselSmall = ({ column, gap, children, height = '400px' }) => {
    const settings = {
        dots: false,
        // infinite: true,
        speed: 2000,
        slidesToScroll: 1,
        slidesToShow: 2,
        autoplay: true,
        autoplaySpeed: 3000,
        draggable: true,
        variableWidth: true,
        swipeToSlide: true,
        infinite: false,
        // nextArrow: <ImgButton img={arrowRight} width="30px" height="30px" />,
        // prevArrow: <ImgButton img={arrowRight} revert={true} width="30px" height="30px" />,
    };
    return (
        <div style={{ '--slide-gap': gap + 'px', height }}>
            <Slider {...settings} className="landing-list">
                {children}
            </Slider>
        </div>
    );
};

export default SlickCarouselSmall;
