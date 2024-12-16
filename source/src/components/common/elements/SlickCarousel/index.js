import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ImgButton from './Button';
// import arrowRight from '@assets/icons/arowrightbtn.svg';
import arrowRight from '@assets/icons/arowrightbtn.svg';
import { Card } from 'antd';
const SlickCarousel = ({
    className = '',
    responsive = true,
    column = 3,
    gap = 10,
    children,
    height = '400px',
    variableWidth = true,
    infinite = false,
    slidesToScroll = 1,
    marginTopArrow,
    nextArrow = <ImgButton img={arrowRight} marginTop={marginTopArrow} />,
    prevArrow = <ImgButton img={arrowRight} revert={true} marginTop={marginTopArrow} />,
}) => {
    const settings = {
        dots: false,
        infinite: infinite,
        speed: 500,
        slidesToShow: column,
        slidesToScroll: slidesToScroll,
        draggable: true,
        variableWidth: false, // Đặt thành false
        nextArrow: nextArrow,
        prevArrow: prevArrow,
        responsive: responsive
            ? [
                {
                    breakpoint: 1536,
                    settings: {
                        slidesToShow: column - 1,
                        slidesToScroll: 1,
                        variableWidth: false,
                    },
                },
                {
                    breakpoint: 1280,
                    settings: {
                        slidesToShow: column - 1,
                        slidesToScroll: 1,
                    },
                },
                {
                    breakpoint: 992,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1,
                    },
                },
                {
                    breakpoint: 640,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                    },
                },
            ]
            : [],
    };
    const listProductRelated = [
        { id: 1, name: 'Product 1', image: 'https://via.placeholder.com/150' },
        { id: 2, name: 'Product 2', image: 'https://via.placeholder.com/150' },
        { id: 3, name: 'Product 3', image: 'https://via.placeholder.com/150' },
        { id: 4, name: 'Product 4', image: 'https://via.placeholder.com/150' },
    ];
    return (
        <div style={{ '--slide-gap': `${gap}px`, height, maxWidth: '100%' }} className={className}>
            <Slider {...settings} className="landing-list">
                {listProductRelated?.map((product) => (
                    <Card
                        key={product.id}
                        style={{
                            width: '100%',
                            height: 300,
                            backgroundColor: '#1f1f1f',
                            textAlign: 'center',
                            padding: '20px',
                        }}
                    >
                        <img
                            src={product.image}
                            alt={product.name}
                            style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                        <div>{product.name}</div>
                    </Card>
                ))}
            </Slider>
        </div>
    );
};

export default SlickCarousel;
