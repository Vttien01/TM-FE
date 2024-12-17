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
import { Button, Flex, Form, Result, Spin, Steps, Typography, theme } from 'antd';
import { defineMessage } from 'react-intl';
import Container from '@components/common/elements/Container';
import styles from './index.module.scss';
import { showSucsessMessage } from '@services/notifyService';

const decription = defineMessage({
    first: 'Kiểm tra số lượng sản phẩm',
    second: 'Thanh toán đơn hàng',
    third: 'Hoàn thành các bước',
});

const ResultSuccess = () => {
    const { profile } = useAuth();
    const navigate = useNavigate();
    const queryParameters = new URLSearchParams(window.location.search);
    const payerId = queryParameters.get('PayerID');
    const paymentId = queryParameters.get('paymentId');
    const orderId = queryParameters.get('orderId');
    const {
        data: dataSuccessPay,
        execute: executeSuccessPay,
        loading: loadingSuccessPay,
    } = useFetch(apiConfig.transaction.successPay, {
        immediate: false,
    });
    useEffect(() => {
        if (payerId && paymentId && orderId) {
            executeSuccessPay({
                params: {
                    PayerID: payerId,
                    paymentId,
                    orderId,
                },
                onCompleted: () => {
                    showSucsessMessage('Cập nhật trạng thái thanh toán thành công');
                },
            });
        }
    }, [ payerId, paymentId, orderId ]);

    const { token } = theme.useToken();
    const [ current, setCurrent ] = useState(2);

    const steps = [
        {
            title: 'Đơn hàng',
            status: 'finish',
            // icon: <SolutionOutlined />,
            decription: decription.first,
        },
        {
            title: 'Thanh toán',
            status: 'finish',
            // icon: <LoadingOutlined />,
            decription: decription.second,
        },
        {
            title: 'Hoàn thành',
            status: 'finish',
            // icon: <SmileOutlined />,
            content: (
                <Spin spinning={loadingSuccessPay}>
                    <Result
                        status="success"
                        title="Đơn hàng của bạn đang được xử lý"
                        subTitle="Vui lòng theo dõi email để biết quá trình giao hàng."
                        extra={[
                            <Button type="primary" key="console">
                                <a href="/">Quay về trang chủ</a>
                            </Button>,
                        ]}
                    />
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

    const [ quantity, setQuantity ] = useState(1);

    // getting single product
    // useEffect(() => {
    //     dispatch(fetchAsyncProductSingle(id));

    //     if (cartMessageStatus) {
    //         setTimeout(() => {
    //             dispatch(setCartMessageOff());
    //         }, 2000);
    //     }
    // }, [cartMessageStatus]);

    return (
        <Container className={styles.container}>
            <PageWrapper
                routes={[ { breadcrumbName: 'Đặt hàng' } ]}
                // title={title}
            >
                <Flex justify="start" align="center" vertical style={{ margin: '20px', height: 'max-content' }}>
                    <Steps current={current} items={items} size="large" />
                    <div style={contentStyle}>{steps[2].content}</div>
                </Flex>
            </PageWrapper>
        </Container>
    );
};

export default ResultSuccess;
