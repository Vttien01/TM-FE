/* eslint-disable indent */
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
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
import { Button, Divider, Flex, Form, Input, Result, Space, Steps, Table, Tag, Typography, theme } from 'antd';
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

    useEffect(() => {
        if (receivedData) {
            setArrayBuyNow((prevArray) => [ ...prevArray, receivedData ]);
        }
        executeGetMyAddress();
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
            array2 = cartItem.map((item) => ({
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
        console.log('order confirm', values);

        createOrderForUser({
            data: { ...updatedValues },
            onCompleted: (respone) => {
                dispatch(getCartItemList([]));
                if (values.paymentMethod === 1) {
                    createTransactionPaypal({
                        data: {
                            orderId: respone.data.orderId,
                            urlCancel: `${apiFrontend}my-order-fail`,
                            urlSuccess: `${apiFrontend}my-order-success`,
                        },
                        onCompleted: (res) => {
                            // window.location.href = res.data;
                            window.open(res.data, '_blank');
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
                            window.open(res.data, '_blank');
                            setCurrent(1);
                            showSucsessMessage('Đơn hàng đang được xử lý!');
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
                    setTimeout(() => {
                        navigate(routes.HistoryOrder.path);
                    }, 4000);
                }
            },
            onError: (error) => {
                showErrorMessage('Đặt hàng thất bại');
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
                    profile={profile}
                    form={form}
                    dataMyAddress={dataMyAddress}
                    renderTitle={renderTitle}
                    onConfirmOrder={onConfirmOrder}
                    loadingCreateOrderForUser={loadingCreateOrderForUser}
                    loadingCreateTransactionPaypal={loadingCreateTransactionPaypal}
                    loadingCreateTransactionVnpal={loadingCreateTransactionVnpal}
                />
            ),
            decription: decription.first,
        },
        // {
        //     title: 'Thanh toán',
        //     content: (
        //         <Form
        //             onFinish={onConfirmOrder}
        //             labelCol={{
        //                 span: 7,
        //             }}
        //             wrapperCol={{
        //                 span: 18,
        //             }}
        //             layout="horizontal"
        //             style={{
        //                 maxWidth: 900,
        //                 marginTop: 20,
        //             }}
        //             initialValues={{
        //                 receiver: profile?.account?.fullName,
        //                 email: profile?.account?.email,
        //                 address: profile?.account?.address,
        //                 phone: profile?.account?.phone,
        //             }}
        //         >
        //             <Form.Item
        //                 rules={[
        //                     {
        //                         required: true,
        //                         message: 'Vui lòng điền tên',
        //                     },
        //                 ]}
        //                 label="Họ và tên"
        //                 name="receiver"
        //                 contentWrapperStyle={{ width: 200 }}
        //             >
        //                 <Input placeholder="Nhập tên ..." />
        //             </Form.Item>
        //             <Form.Item
        //                 rules={[
        //                     {
        //                         required: true,
        //                         type: 'email',
        //                         message: 'Vui lòng điền email',
        //                     },
        //                 ]}
        //                 label="Email"
        //                 name="email"
        //             >
        //                 <Input placeholder="Nhập email ..." />
        //             </Form.Item>
        //             <Form.Item
        //                 rules={[
        //                     {
        //                         required: true,
        //                         message: 'Vui lòng điền số điện thoại',
        //                     },
        //                 ]}
        //                 label="Số điện thoại"
        //                 name="phone"
        //             >
        //                 <Input placeholder="Nhập số điện thoại ..." />
        //             </Form.Item>

        //             <Form.Item label="Ghi chú" name="note">
        //                 <Input placeholder="Nhập ghi chú ..." />
        //             </Form.Item>
        //             <AutoCompleteField
        //                 label="Mã giảm giá"
        //                 name="voucherId"
        //                 apiConfig={apiConfig.voucher.getMyVoucher}
        //                 mappingOptions={(item) => ({ value: item.id, label: item.address })}
        //             />
        //             <SelectField
        //                 label="Địa chỉ"
        //                 name="addressId"
        //                 required
        //                 dropdownRender={(menu) => {
        //                     return (
        //                         <>
        //                             {menu}
        //                             <Divider
        //                                 style={{
        //                                     margin: '8px 0',
        //                                 }}
        //                             />
        //                             <Space
        //                                 style={{
        //                                     padding: '0 8px 4px',
        //                                     justifyContent: 'center',
        //                                     justifyItems: 'center',
        //                                 }}
        //                             >
        //                                 <Button
        //                                     type="text"
        //                                     icon={<IconPlus size={10} />}
        //                                     onClick={() => {
        //                                         setItem1(null);
        //                                         handlerDetailsModal.open();
        //                                     }}
        //                                 >
        //                                     Thêm địa chỉ giao hàng
        //                                 </Button>
        //                             </Space>
        //                         </>
        //                     );
        //                 }}
        //                 allowClear={false}
        //                 options={dataMyAddress}
        //                 mappingOptions={(item) => ({ value: item.id, label: renderTitle(item.label, item) })}
        //             />

        //             <SelectField
        //                 name="paymentMethod"
        //                 label="Hình thức thanh toán"
        //                 allowClear={false}
        //                 options={paymentSelect}
        //                 required
        //             />
        //             <Button
        //                 type="primary"
        //                 htmlType="submit"
        //                 loading={loadings[0]}
        //                 onClick={() => enterLoading(0)}
        //                 style={{ marginBottom: 20 }}
        //             >
        //                 Xác nhận đặt hàng
        //             </Button>
        //         </Form>
        //     ),
        //     decription: decription.second,
        // },
        {
            title: 'Hoàn thành',
            content: (
                <Result
                    status="success"
                    title="Đơn hàng của bạn đang được xử lý!"
                    subTitle="Vui lòng theo dõi email để biết quá trình giao hàng."
                    extra={[
                        <Button type="primary" key="console">
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
