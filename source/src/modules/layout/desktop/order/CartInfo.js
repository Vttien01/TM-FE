import SkeLeton from '@components/common/elements/Skeleton';
import Typo from '@components/common/elements/Typo';
import { paymentMethods, paymentSelect, paymentSelectIcon, storageKeys } from '@constants';
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
import { Button, Col, Divider, Flex, Form, Image, Input, Radio, Row, Space, Typography } from 'antd';
import InputTextField from '@components/common/form/InputTextField';
import ItemCart from '@components/common/elements/itemCard/ItemCart';
import AutoCompleteField from '@components/common/form/AutoCompleteField';
import apiConfig from '@constants/apiConfig';
import SelectField from '@components/common/form/SelectField';
import { IconEdit, IconMoneybag, IconPlus } from '@tabler/icons-react';
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
    arrayBuyNow,
    dataMyVoucher,
    handlerDetailsModal,
    setItem1,
}) => {
    const translate = useTranslate();
    const { memberShip } = useAuth();
    const course = getData(storageKeys.BUY_COURSE_DIRECT);
    const cart = useSelector((state) => state.cart.cart);
    const queryParameters = new URLSearchParams(window.location.search);
    const isBuyDirect = queryParameters.get('isBuyDirect');
    const [ itemCoupon, setItemCoupon ] = useState(null);
    const data = arrayBuyNow?.length > 0 ? arrayBuyNow : cart;
    const realTotalPay = data ? realTotal(data) : 0;
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
                                    <SelectField
                                        name="voucherId"
                                        allowClear={false}
                                        options={dataMyVoucher}
                                        // mappingOptions={(item) => ({
                                        //     value: item.id,
                                        //     label: item.title,
                                        //     percent: item?.percent,
                                        //     priceMax: item?.priceMax,
                                        // })}
                                        style={{ height: '40px' }}
                                        onChange={(value, item) => {
                                            setItemCoupon(item);
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
                                            {paymentSelectIcon.map((item, index) => (
                                                <Radio value={item.value} key={index}>
                                                    <Flex
                                                        align="ccenter"
                                                        justify="center"
                                                        gap={4}
                                                        style={{ marginTop: 6 }}
                                                    >
                                                        <Image src={item.icon} width={24} height={24} preview={false} />
                                                        <span>{item.label}</span>
                                                    </Flex>
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
    }, [ dataMyVoucher ]);

    const CartInfo = useCallback(() => {
        const checkVoucher = (realTotalPay * itemCoupon?.percent) / 100 < itemCoupon?.priceMax;
        const voucherPrice =
            itemCoupon != null ? (checkVoucher ? (realTotalPay * itemCoupon?.percent) / 100 : itemCoupon?.priceMax) : 0;
        const totalPrice = itemCoupon != null ? realTotalPay - voucherPrice : realTotalPay;
        return (
            <div>
                <Divider />
                <div>
                    {arrayBuyNow?.length > 0
                        ? ` ${1} sản phẩm cần thanh toán`
                        : ` ${data?.length} sản phẩm trong giỏ hàng`}
                </div>
                <div className={styles.cartList}>
                    {data ? data?.map((item, index) => <ItemCart key={index} data={item} />) : <SkeLeton numRow={8} />}
                </div>
                <Divider style={{ marginTop: 15 }} />
                <Flex style={{ marginTop: 10 }} vertical gap={8}>
                    <Flex justify="space-between">
                        <span>{translate.formatMessage(message.price)}</span>
                        <span>{data && price(realTotalPay)}</span>
                    </Flex>
                    {itemCoupon != null && (
                        <Flex justify="space-between">
                            <span>{translate.formatMessage(message.saleVoucher)}</span>
                            <div>
                                <span className={styles.oldPrice}>
                                    {checkVoucher ? `-${itemCoupon?.percent}%` : 'Giảm tối đa'}
                                </span>
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
    }, [ data, itemCoupon ]);

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
                                                    setItem1(null);
                                                    handlerDetailsModal.open();
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
