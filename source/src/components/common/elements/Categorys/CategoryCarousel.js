import SlickCarousel from '@modules/layout/desktop/landing/common/SlickCarousell';
import React from 'react';
import CardCategory from '../CardCategorys';
import SkeLeton from '../Skeleton';
const CategoryCarousel = ({ data }) => {
    return data ? (
        <SlickCarousel gap={7} column={5} height='350px'>
            {data?.map((item) => {
                return <CardCategory key={item?.id} data={item} />;
            })}
        </SlickCarousel>
    ) : (
        <SkeLeton numRow={12} />
    );
};

export default CategoryCarousel;
