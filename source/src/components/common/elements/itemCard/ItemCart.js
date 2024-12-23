// import IconClock from '@assets/icons/clockicon.png';
// import IconCourse from '@assets/icons/courseicon.png';
import product from '@assets/images/product.jpg';
import React from 'react';
import styles from './ItemCart.module.scss';

import { AppConstants } from '@constants';
import { commonMessage } from '@constants/intl';
import useTranslate from '@hooks/useTranslate';
import { getImageUrl, price, timeConvert } from '@utils';
import { useNavigate } from 'react-router-dom';
import { Flex, Image, Rate, Typography } from 'antd';
const ItemCart = ({ data, checkSellCode, coupon }) => {
    const navigation = useNavigate();
    const saleTotal = 0;
    const paymentTotal = data?.saleOff ? data?.price - ((data?.price * 1) / 100) * data?.saleOff : data?.price;

    const translate = useTranslate();
    return (
        <div className={styles.item}>
            <Flex className={styles.content}>
                <Image
                    src={data?.image ? getImageUrl(data?.image) : product}
                    alt="Relevant Image"
                    radius="md"
                    style={{ width: 100, height: 100 }}
                    fallbackSrc={product}
                />
                <Flex style={{ width: '100%', overflow: 'hidden', paddingLeft: 10 }} vertical>
                    <Typography.Title level={4} type="semi-bold" className={styles.titleItem}>
                        {/* <FormattedMessage defaultMessage="Khóa học Figma thiết kế chuyên nghiệp" /> */}
                        {data?.productName}
                    </Typography.Title>
                    <Flex justify="start">
                        {/* <Flex>
                            <Rate value={data?.averageStar} disabled></Rate>
                        </Flex> */}
                        <Flex align="end" gap={8}>
                            <span style={{ color: 'var(--primary-color)', fontWeight: 700, fontSize: 18 }}>
                                {data?.price == 0
                                    ? translate.formatMessage(commonMessage.free)
                                    : coupon
                                        ? price(paymentTotal - coupon > 0 ? paymentTotal - coupon : 0)
                                        : price(paymentTotal)}
                            </span>
                            <span style={{ color: 'var(--black-color)', lineHeight: 'normal' }}>x{data?.quantity}</span>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </div>
    );
};

export default ItemCart;
