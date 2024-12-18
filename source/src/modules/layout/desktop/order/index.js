/* eslint-disable indent */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatePath, useLocation, useNavigate } from 'react-router-dom';
import styles from './index.module.scss';
import PageWrapper from '@components/common/layout/PageWrapper';
import { apiFrontend, paymentSelect } from '@constants';
import apiConfig from '@constants/apiConfig';
import useAuth from '@hooks/useAuth';
import useDisclosure from '@hooks/useDisclosure';
import useFetch from '@hooks/useFetch';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import { showErrorMessage, showSucsessMessage } from '@services/notifyService';
import { IconEdit, IconPlus } from '@tabler/icons-react';
import { formatMoney } from '@utils';
import { Button, Divider, Flex, Form, Input, Modal, Result, Space, Steps, Table, Tag, Typography, theme } from 'antd';
import { defineMessage } from 'react-intl';
import ListDetailsForm from './ListDetailsForm';
import Container from '@components/common/elements/Container';
import { getCartItemList } from '@store/actions/cart';
import CartInfo from './CartInfo';
const { Text } = Typography;
let index = 0;

const decription = defineMessage({
    first: 'Kiểm tra số lượng sản phẩm',
    second: 'Thanh toán đơn hàng',
    third: 'Hoàn thành các bước',
});

const OrderPage = () => {
    const { profile } = useAuth();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const queryParameters = new URLSearchParams(window.location.search);
    const [ openedDetailsModal, handlerDetailsModal ] = useDisclosure(false);
    const [ form ] = Form.useForm();
    const translate = useTranslate();
    const [ item1, setItem1 ] = useState(null);
    const [ arrayBuyNow, setArrayBuyNow ] = useState([]);
    const cart = useSelector((state) => state.cart.cart);

    const location = useLocation();
    const receivedData = location.state?.data;
    const { data: dataMyAddress, execute: executeGetMyAddress } = useFetch(apiConfig.address.getMyAddress, {
        immediate: false,
        mappingData: ({ data }) => {
            return data.content.map((item) => ({
                label: item.address,
                value: item.id,
            }));
        },
    });
    const { data: dataMyVoucher, execute: executeGetMyVoucher } = useFetch(apiConfig.voucher.getMyVoucher, {
        immediate: false,
        mappingData: ({ data }) => {
            return data.map((item) => ({
                ...item,
                label: item.title,
                value: item.id,
                percent: item.percent,
                priceMax: item?.priceMax,
            }));
        },
    });

    useEffect(() => {
        if (receivedData) {
            setArrayBuyNow([ receivedData ]);
        }
        executeGetMyAddress();
        executeGetMyVoucher();
    }, [ receivedData ]);

    const renderTitle = (title, item) => (
        <span>
            {title}
            <a
                style={{
                    float: 'right',
                }}
                onClick={() => handleEdit(item)}
            >
                <IconEdit size={17} style={{ paddingTop: 4 }} />
            </a>
        </span>
    );

    const handleEdit = (item) => {
        setItem1(item);
        handlerDetailsModal.open();
    };

    const { token } = theme.useToken();
    const [ current, setCurrent ] = useState(0);
    const next = () => {
        setCurrent(current + 1);
    };
    const prev = () => {
        setCurrent(current - 1);
    };
    const { data: cartItem } = useFetch(apiConfig.cart.getList, {
        immediate: true,
        mappingData: ({ data }) => data.cartDetailDtos,
    });
    const { execute: deleteCartItem } = useFetch(apiConfig.cart.delete);

    const {
        data: order,
        execute: createOrderForUser,
        loading: loadingCreateOrderForUser,
    } = useFetch({
        ...apiConfig.order.createForUser,
    });

    const { execute: createTransactionPaypal, loading: loadingCreateTransactionPaypal } = useFetch({
        ...apiConfig.transaction.create,
    });
    const { execute: createTransactionVnpal, loading: loadingCreateTransactionVnpal } = useFetch({
        ...apiConfig.transaction.vnpay,
    });

    const { execute: executeSuccessPay } = useFetch({
        ...apiConfig.transaction.successPay,
    });

    const { execute: executeCancelPay } = useFetch({
        ...apiConfig.transaction.cancelPay,
    });
    const { execute: executeUpdateCart } = useFetch(apiConfig.cart.update, { immediate: false });
    const showConfirmBuyOrder = (message, match) => {
        Modal.confirm({
            // title: match > 0 ? message : 'Sản phẩm hiện tại đã hết hàng, bạn cần thêm giỏ hàng khác?',
            title: message,
            footer: () => (
                <Flex justify="end">
                    <Button
                        onClick={() => {
                            Modal.destroyAll();
                            navigate('/');
                        }}
                    >
                        Quay về trang chủ
                    </Button>
                    {
                        <Button
                            type="primary"
                            onClick={() => {
                                Modal.destroyAll();
                                dispatch(getCartItemList(cartItem));
                            }}
                        >
                            Xác nhận
                        </Button>
                    }
                </Flex>
            ),
        });
    };

    function onConfirmOrder(values) {
        let array2 = [];
        if (receivedData) {
            array2 = [ ...array2, receivedData ];
            array2 = array2.map((item) => ({
                color: item.color,
                price: item.price,
                productName: item.productName,
                productVariantId: item.variantId,
                quantity: item.quantity,
            }));
        } else {
            array2 = cart.map((item) => ({
                color: item.color,
                price: item.price,
                productName: item.productName,
                productVariantId: item.variantId,
                quantity: item.quantity,
            }));
        }

        const updatedValues = {
            ...values,
            listOrderProduct: array2, // Thay yourListOrderProductArray bằng mảng thực tế của bạn
        };
        createOrderForUser({
            data: { ...updatedValues },
            onCompleted: (respone) => {
                if (receivedData == null) {
                    dispatch(getCartItemList([]));
                    executeUpdateCart({
                        data: {
                            cartDetails: [],
                        },
                    });
                }
                if (values.paymentMethod === 1) {
                    createTransactionPaypal({
                        data: {
                            orderId: respone.data.orderId,
                            urlCancel: `${apiFrontend}my-order-fail`,
                            urlSuccess: `${apiFrontend}my-order-success`,
                        },
                        onCompleted: (res) => {
                            window.location.href = res.data;
                            // window.open(res.data, '_blank');
                            setCurrent(1);
                            showSucsessMessage('Đơn hàng đang được xử lý!');
                        },
                        onError: () => {
                            showErrorMessage('Thanh toán PAYPAL thất bại');
                            setCurrent(1);
                            form.resetFields();
                        },
                    });
                } else if (values.paymentMethod === 2) {
                    createTransactionVnpal({
                        data: {
                            orderId: respone.data.orderId,
                            urlCancel: `${apiFrontend}my-order-fail`,
                            urlSuccess: `${apiFrontend}my-order-success`,
                        },
                        onCompleted: (res) => {
                            window.location.href = res.data.paymentUrl;
                            // window.open(res.data.paymentUrl, '_blank');
                            setCurrent(1);
                            showSucsessMessage('Thanh toán VNPAY thành công!');
                        },
                        onError: () => {
                            showErrorMessage('Thanh toán VNPAY thất bại');
                            setCurrent(1);
                            form.resetFields();
                            // setTimeout(() => {
                            //     window.location.reload();
                            // }, 2000);
                        },
                    });
                } else {
                    setCurrent(1);
                    showSucsessMessage('Đặt hàng thành công');
                    // setTimeout(() => {
                    //     navigate(routes.HistoryOrder.path);
                    // }, 4000);
                }
            },
            onError: (error) => {
                if (error.code === 'ERROR-PRODUCT-VARIANT-0001') {
                    // showErrorMessage(error.message);
                    const match = error?.message.match(/hiện chỉ còn (\d+)/);
                    showConfirmBuyOrder(error.message, match ? match[1] : '0');
                } else {
                    showErrorMessage('Đặt hàng thất bại');
                }
            },
        });
    }
    const [ loadings, setLoadings ] = useState([]);
    const enterLoading = (index) => {
        setLoadings((prevLoadings) => {
            const newLoadings = [ ...prevLoadings ];
            newLoadings[index] = true;
            return newLoadings;
        });
        setTimeout(() => {
            setLoadings((prevLoadings) => {
                const newLoadings = [ ...prevLoadings ];
                newLoadings[index] = false;
                return newLoadings;
            });
        }, 4000);
    };
    const steps = [
        {
            title: 'Đơn hàng',
            status: 'finish',
            content: (
                <CartInfo
                    arrayBuyNow={arrayBuyNow}
                    profile={profile}
                    form={form}
                    dataMyAddress={dataMyAddress}
                    renderTitle={renderTitle}
                    onConfirmOrder={onConfirmOrder}
                    loadingCreateOrderForUser={loadingCreateOrderForUser}
                    loadingCreateTransactionPaypal={loadingCreateTransactionPaypal}
                    loadingCreateTransactionVnpal={loadingCreateTransactionVnpal}
                    dataMyVoucher={dataMyVoucher}
                    handlerDetailsModal={handlerDetailsModal}
                    setItem1={setItem1}
                />
            ),
            decription: decription.first,
        },
        {
            title: 'Hoàn thành',
            content: (
                <Result
                    status="success"
                    title="Đơn hàng của bạn đang được xử lý!"
                    subTitle="Vui lòng theo dõi email để biết quá trình giao hàng."
                    extra={[
                        <Button type="primary" key="home">
                            <a href="/">Quay về trang chủ</a>
                        </Button>,
                        <Button key="buy">
                            <a href="/history-order">Lịch sử đơn hàng</a>
                        </Button>,
                    ]}
                />
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

    return (
        <Container className={styles.container}>
            <PageWrapper routes={[ { breadcrumbName: 'Đặt hàng' } ]}>
                <ListDetailsForm
                    open={openedDetailsModal}
                    onCancel={() => handlerDetailsModal.close()}
                    form={form}
                    data={item1}
                    isEditing={!!item1}
                    executeGetMyAddress={() => executeGetMyAddress()}
                />
                <Flex
                    justify="start"
                    align="center"
                    vertical
                    style={{ margin: '20px', height: 'max-content', minHeight: '70vh' }}
                >
                    <Steps current={current} items={items} size="large" />
                    <div style={{ width: '90%' }}>{steps[current].content}</div>
                </Flex>
            </PageWrapper>
        </Container>
    );
};

export default OrderPage;
