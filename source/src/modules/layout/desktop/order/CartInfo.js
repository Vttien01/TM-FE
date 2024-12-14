import SkeLeton from '@components/common/elements/Skeleton';
import Typo from '@components/common/elements/Typo';
import { paymentMethods, paymentSelect, storageKeys } from '@constants';
import useTranslate from '@hooks/useTranslate';
import { grandTotal, grandTotalCoupon, price, realTotal } from '@utils';
import { getData } from '@utils/localStorage';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { defineMessages } from 'react-intl';
import { useSelector } from 'react-redux';
import styles from './cartInfo.module.scss';
import { useNavigate } from 'react-router-dom';
import useAuth from '@hooks/useAuth';
// import wallet from '@assets/images/wallet.jpg';
// import credit from '@assets/images/credit.png';
import { Button, Col, Divider, Flex, Form, Image, Input, Radio, Row, Space, Typography } from 'antd';
import InputTextField from '@components/common/form/InputTextField';
import ItemCart from '@components/common/elements/itemCard/ItemCart';
import AutoCompleteField from '@components/common/form/AutoCompleteField';
import apiConfig from '@constants/apiConfig';
import SelectField from '@components/common/form/SelectField';
import { IconEdit, IconPlus } from '@tabler/icons-react';
const message = defineMessages({
    cartInfo: 'Thông tin đơn hàng',
});

const CartInfo = ({
    profile,
    form,
    dataMyAddress,
    renderTitle,
    onConfirmOrder,
    loadingCreateOrderForUser,
    loadingCreateTransactionPaypal,
    loadingCreateTransactionVnpal,
}) => {
    const translate = useTranslate();
    const { memberShip } = useAuth();

    const course = getData(storageKeys.BUY_COURSE_DIRECT);
    const cart = useSelector((state) => state.cart.cart);
    const queryParameters = new URLSearchParams(window.location.search);
    const isBuyDirect = queryParameters.get('isBuyDirect');
    const [ coupon, setCoupon ] = useState(null);
    const realTotalPay = isBuyDirect ? course?.price : cart ? realTotal(cart) : 0;
    const message = defineMessages({
        summaryCheckout: 'Tóm tắt đơn hàng',
        price: 'Giá gốc',
        sale: 'Giảm giá',
        saleVoucher: 'Voucher',
        apply: 'Áp dụng',
        payment: 'Thanh toán',
        total: 'Thành tiền',
        coupon: 'Mã giảm giá',
        checkout: 'Tổng thanh toán',
        provide: 'Đơn vị cung cấp',
    });

    const PaymentForm = useCallback(() => {
        return (
            <div style={{ marginTop: 20 }}>
                {
                    <>
                        <Divider my={15} />
                        <span style={{ fontSize: 18 }}>Chọn voucher</span>
                        <Form form={form}>
                            <Row gutter={8} style={{ width: '100%', marginTop: 10 }}>
                                <Col span={24}>
                                    <AutoCompleteField
                                        name="voucherId"
                                        apiConfig={apiConfig.voucher.getMyVoucher}
                                        mappingOptions={(item) => ({
                                            value: item.id,
                                            label: item.title,
                                            percent: item?.percent,
                                        })}
                                        searchParams={(text) => ({ title: text, status: 1 })}
                                        onChange={(value, item) => {
                                            setCoupon(item?.percent);
                                        }}
                                    />
                                </Col>
                                <Col span={24}>
                                    <span style={{ fontSize: 18 }}>Chọn phương thức thanh toán</span>
                                    <Form.Item name={'paymentMethod'}>
                                        <Radio.Group
                                            defaultValue={0}
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                marginTop: 10,
                                            }}
                                        >
                                            {paymentSelect.map((item, index) => (
                                                <Radio value={item.value} key={index}>
                                                    {item.label}
                                                </Radio>
                                            ))}
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </>
                }
            </div>
        );
    }, []);

    const CartInfo = useCallback(() => {
        const totalPrice = coupon != null ? realTotalPay - (realTotalPay * coupon) / 100 : realTotalPay;
        const voucherPrice = coupon != null ? (realTotalPay * coupon) / 100 : 0;
        return (
            <div>
                <Divider />
                <div>{isBuyDirect ? ` ${1} sản phẩm trong giỏ hàng` : ` ${cart?.length} sản phẩm trong giỏ hàng`}</div>
                <div className={styles.cartList}>
                    {cart ? cart?.map((item, index) => <ItemCart key={index} data={item} />) : <SkeLeton numRow={8} />}
                </div>
                <Divider style={{ marginTop: 15 }} />
                <Flex style={{ marginTop: 10 }} vertical>
                    <Flex justify="space-between">
                        <span>{translate.formatMessage(message.price)}</span>
                        <span>{cart && price(realTotalPay)}</span>
                    </Flex>
                    {coupon != null && (
                        <Flex justify="space-between">
                            <span>{translate.formatMessage(message.saleVoucher)}</span>
                            <div>
                                <span className={styles.oldPrice}>-{coupon}%</span>
                                <span>{price(voucherPrice)}</span>
                            </div>
                        </Flex>
                    )}
                    <Flex justify="space-between" align="start">
                        <span>{translate.formatMessage(message.checkout)}</span>
                        <Typo className={styles.price} size="small" type="semi-bold">
                            {price(totalPrice)}
                        </Typo>
                    </Flex>
                </Flex>
            </div>
        );
    }, [ cart, coupon ]);

    return (
        <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
            <div className={styles.boxLeft}>
                <div style={{ marginTop: 20 }}>
                    <Typography.Title level={3} type="semi-bold">
                        Thông tin đơn hàng
                    </Typography.Title>
                    <CartInfo />
                </div>
                <PaymentForm />
            </div>
            <div className={styles.boxRight}>
                <div style={{ marginTop: 20 }}>
                    <Typography.Title level={3} type="semi-bold">
                        Thông tin khách hàng
                    </Typography.Title>
                    <Form
                        onFinish={(value) => {
                            onConfirmOrder(value);
                        }}
                        form={form}
                        layout="vertical"
                        style={{ width: '100%' }}
                        initialValues={{
                            receiver: profile?.account?.fullName,
                            email: profile?.account?.email,
                            address: profile?.account?.address,
                            phone: profile?.account?.phone,
                            paymentMethod: 0,
                        }}
                    >
                        <Form.Item
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng điền tên',
                                },
                            ]}
                            label="Họ và tên"
                            name="receiver"
                            contentWrapperStyle={{ width: 200 }}
                        >
                            <Input placeholder="Nhập tên ..." />
                        </Form.Item>
                        <Form.Item
                            rules={[
                                {
                                    required: true,
                                    type: 'email',
                                    message: 'Vui lòng điền email',
                                },
                            ]}
                            label="Email"
                            name="email"
                        >
                            <Input placeholder="Nhập email ..." />
                        </Form.Item>
                        <Form.Item
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng điền số điện thoại',
                                },
                            ]}
                            label="Số điện thoại"
                            name="phone"
                        >
                            <Input placeholder="Nhập số điện thoại ..." />
                        </Form.Item>
                        <SelectField
                            label="Địa chỉ"
                            name="addressId"
                            required
                            dropdownRender={(menu) => {
                                return (
                                    <>
                                        {menu}
                                        <Divider
                                            style={{
                                                margin: '8px 0',
                                            }}
                                        />
                                        <Space
                                            style={{
                                                padding: '0 8px 4px',
                                                justifyContent: 'center',
                                                justifyItems: 'center',
                                            }}
                                        >
                                            {/* <Input
                                        placeholder="Please enter item"
                                        ref={inputRef}
                                        value={name}
                                        onChange={onNameChange}
                                        onKeyDown={(e) => e.stopPropagation()}
                                    /> */}
                                            <Button
                                                type="text"
                                                icon={<IconPlus size={10} />}
                                                onClick={() => {
                                                    // setItem1(null);
                                                    // handlerDetailsModal.open();
                                                }}
                                            >
                                                Thêm địa chỉ giao hàng
                                            </Button>
                                        </Space>
                                    </>
                                );
                            }}
                            allowClear={false}
                            options={dataMyAddress}
                            mappingOptions={(item) => ({ value: item.id, label: renderTitle(item.label, item) })}
                            style={{ height: '40px' }}
                        />
                        <InputTextField placeholder="Nhập ghi chú ..." type="textarea" name="note" label="Ghi chú" />

                        <Button
                            type="primary"
                            htmlType="submit"
                            // loading={loadings[0]}
                            // onClick={() => enterLoading(0)}
                            style={{ marginBottom: 20, width: '100%' }}
                            size="large"
                            loading={
                                loadingCreateOrderForUser ||
                                loadingCreateTransactionPaypal ||
                                loadingCreateTransactionVnpal
                            }
                        >
                            Xác nhận đặt hàng
                        </Button>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default CartInfo;
