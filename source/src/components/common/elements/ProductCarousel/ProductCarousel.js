import React, { useCallback, useState } from 'react';
import './ProductCarousel.scss';
import Product from '../Product';
import { Badge, Button, Card, Col, Row } from 'antd';
import SlickCarousel from '../SlickCarousel';

const ProductCarousel = ({ products, executGetProductDetail, loadingProductDetail, style }) => {
    const [ visibleItems, setVisibleItems ] = useState(4);

    const onLoadMore = () => {
        setVisibleItems((prev) => prev + 4);
    };
    const CardItem = useCallback(
        ({ title, content }) => {
            if (!products) {
                return null;
            }
            return (
                <Card
                    title={title}
                    style={{ ...style, marginBottom: '24px', backgroundColor: 'var(--primary-light-color)' }}
                    // headStyle={{ background: '#1890ff', color: '#fff' }}
                >
                    <Row gutter={[ 16, 16 ]} align={'start'}>
                        <SlickCarousel gap={7} column={5} height="350px">
                            {products?.map((item) => {
                                // return <CardCategory key={item?.id} data={item} />;
                                return (
                                    <Product
                                        key={item.id}
                                        product={{ ...item }}
                                        loadingProductDetail={loadingProductDetail}
                                        executGetProductDetail={executGetProductDetail}
                                    />
                                );
                            })}
                        </SlickCarousel>
                        {/* {products?.length > 0
                            ? products.slice(0, visibleItems).map((product, index) => (
                                <Col xs={24} sm={12} md={8} lg={6} xl={4.8} key={index}>
                                    <Product
                                        key={product.id}
                                        product={{ ...product }}
                                        loadingProductDetail={loadingProductDetail}
                                        executGetProductDetail={executGetProductDetail}
                                    />
                                </Col>
                            ))
                            : null} */}
                    </Row>
                    {/* <Row gutter={[ 16, 16 ]} align={'center'}>
                        {visibleItems < products.length && (
                            <div style={{ textAlign: 'center', marginTop: 16, marginBottom: 16 }}>
                                <Button onClick={onLoadMore}>Xem thêm</Button>
                            </div>
                        )}
                    </Row> */}
                </Card>
            );
        },
        [ products, visibleItems ],
    );
    return (
        <>
            <CardItem />
            {/* <CartModal
                open={openedDetailsModal}
                onCancel={() => handlerDetailsModal.close()}
                check={1}
                product={product}
            /> */}
        </>
    );
};

export default ProductCarousel;
