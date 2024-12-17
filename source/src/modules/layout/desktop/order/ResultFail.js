/* eslint-disable indent */
import React, { useEffect, useState } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import './OrderPage.scss';
// import { fetchAsyncProductSingle, getProductSingle, getSingleProductStatus } from '../../store/productSlice';
// import { addToCart, getCartMessageStatus, setCartMessageOff, setCartMessageOn } from '../../store/cartSlice';
// import CartMessage from '../../components/CartMessage/CartMessage';
import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import useAuth from '@hooks/useAuth';
import useFetch from '@hooks/useFetch';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import { Button, Flex, Form, Result, Spin, Steps, theme } from 'antd';
import { defineMessage } from 'react-intl';
import Container from '@components/common/elements/Container';
import styles from './index.module.scss';
import { showErrorMessage } from '@services/notifyService';

const decription = defineMessage({
    first: 'Kiểm tra số lượng sản phẩm',
    second: 'Thanh toán đơn hàng',
    third: 'Hoàn thành các bước',
});

const ResultFail = () => {
    const { token } = theme.useToken();
    const queryParameters = new URLSearchParams(window.location.search);
    const orderId = queryParameters.get('orderId');
    const {
        data: dataFailPay,
        execute: executeFailPay,
        loading: loadingFailPay,
    } = useFetch(apiConfig.transaction.cancelPay, {
        immediate: false,
    });
    useEffect(() => {
        if (orderId) {
            executeFailPay({
                params: {
                    orderId,
                },
                onCompleted: () => {
                    showErrorMessage('Cập nhật trạng thái thanh toán thất bại');
                },
            });
        }
    }, [ orderId ]);
    const steps = [
        {
            title: 'Đơn hàng',
            status: 'finish',
            decription: decription.first,
        },
        {
            title: 'Thanh toán',
            status: 'error',
            decription: decription.second,
        },
        {
            title: 'Hoàn thành',
            status: 'finish',
            content: (
                <Spin spinning={loadingFailPay}>
                    <Result
                        status="warning"
                        title="Thanh toán thất bại!"
                        subTitle="Vui lòng kiểm tra thông tin đặt hàng."
                        extra={[
                            <Button type="primary" key="console">
                                <a href="/">Quay về trang chủ</a>
                            </Button>,
                        ]}
                    ></Result>
                </Spin>
            ),
            decription: decription.third,
        },
    ];
    const items = steps.map((item) => ({
        key: item.title,
        title: item.title,
        icon: item.icon,
        status: item.status,
    }));
    const contentStyle = {
        lineHeight: '260px',
        textAlign: 'center',
        color: token.colorTextTertiary,
        backgroundColor: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        border: `1px dashed ${token.colorBorder}`,
        marginTop: 16,
        width: 1100,
    };

    return (
        <Container className={styles.container}>
            <PageWrapper
                routes={[ { breadcrumbName: 'Đặt hàng' } ]}
                // title={title}
            >
                <Flex justify="start" align="center" vertical style={{ margin: '20px', height: 'max-content' }}>
                    <Steps current={2} items={items} size="large" />
                    <div style={contentStyle}>{steps[2].content}</div>
                </Flex>
            </PageWrapper>
        </Container>
    );
};

export default ResultFail;
