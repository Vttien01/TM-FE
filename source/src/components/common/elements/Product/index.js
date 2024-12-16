import React from 'react';
import { Link } from 'react-router-dom';
import { formatMoney } from '@utils';
import { Badge, Button, Card, Flex } from 'antd';
import styles from './Product.module.scss';

const Product = ({ product, loadingProductDetail, executGetProductDetail, isRealated }) => {
    function truncateText(text, maxLength) {
        return text && text.length > maxLength ? text.slice(0, maxLength).replace(/(\s+\S+)$/, '...') : text;
    }
    let discountedPrice = product.saleOff > 0 ? product.price - product.price * (product.saleOff / 100) : product.price;

    return (
        <>
            <Link to={`/detail/${product?.id}`} key={product?.id}>
                <Badge.Ribbon text={product?.categoryDto.name} color="var(--primary-color)">
                    <Card
                        hoverable
                        cover={<img alt={product.name} src={product.image} />}
                        style={{ height: '100%', backgroundColor: '#fff' }}
                    >
                        <Card.Meta
                            title={product.name}
                            description={
                                <>
                                    {/* <Badge color="purple" text="TIẾT KIỆM" />
                                <div
                                    style={{
                                        color: '#722ed1',
                                        marginTop: 8,
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {product.price}
                                </div> */}
                                    <Flex justify="center" align="start" vertical className={styles.price} gap={8}>
                                        <span
                                            className={styles.oldPrice}
                                            style={{
                                                color: '#ff4d4f',
                                                visibility: discountedPrice == product?.price && 'hidden',
                                            }}
                                        >
                                            {formatMoney(product?.price, {
                                                groupSeparator: ',',
                                                decimalSeparator: '.',
                                                currentcy: 'đ',
                                                currentcyPosition: 'BACK',
                                                currentDecimal: '0',
                                            })}
                                        </span>
                                        <Flex justify="space-between" align="center" style={{ width: '100%' }}>
                                            <span className={styles.newPrice}>
                                                {formatMoney(discountedPrice, {
                                                    groupSeparator: ',',
                                                    decimalSeparator: '.',
                                                    currentcy: 'đ',
                                                    currentcyPosition: 'BACK',
                                                    currentDecimal: '0',
                                                })}
                                            </span>
                                            <span className={styles.newPrice}>Đã bán: {product.soldAmount}</span>
                                        </Flex>
                                        {!isRealated && (
                                            <Button
                                                align="center"
                                                type="dashed"
                                                size="small"
                                                style={{ width: '100%', color: 'orange', padding: '16px 0' }}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    executGetProductDetail({
                                                        pathParams: { id: product.id },
                                                    });
                                                }}
                                                loading={loadingProductDetail}
                                            >
                                                Thêm vào giỏ hàng
                                            </Button>
                                        )}
                                    </Flex>
                                </>
                            }
                        />
                    </Card>
                </Badge.Ribbon>
            </Link>
        </>
    );
};

export default Product;
