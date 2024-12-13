import { UserOutlined } from '@ant-design/icons';
import AvatarField from '@components/common/form/AvatarField';
import { BaseForm } from '@components/common/form/BaseForm';
import TextField from '@components/common/form/TextField';
import { AppConstants } from '@constants';
import apiConfig from '@constants/apiConfig';
import useAuth from '@hooks/useAuth';
import useFetch from '@hooks/useFetch';
import useNotification from '@hooks/useNotification';
import useTranslate from '@hooks/useTranslate';
import { showErrorMessage, showSucsessMessage } from '@services/notifyService';
import { formatMoney } from '@utils';
import { Avatar, Button, Card, Col, Divider, Form, List, Modal, Rate, Row, Space, Typography } from 'antd';
import React, { useState } from 'react';
import { defineMessages } from 'react-intl';

const messages = defineMessages({
    objectName: 'Mua lại đơn hàng',
    update: 'Cập nhật',
    buyAgain: 'Mua lại',
    createSuccess: 'Mua lại đơn hàng thành công',
});
const BuyAgainModal = ({ open, onCancel, detail, orderDetailCommon, setActive }) => {
    const translate = useTranslate();
    const [ form ] = Form.useForm();
    const [ star, setStar ] = useState();
    const notification = useNotification();
    const { data: order, execute: createOrderForUser } = useFetch(apiConfig.order.createForUser, {
        immediate: false,
    });
    const { profile } = useAuth();
    const handleCreateReview = (value) => {
        const array2 =
            detail?.length > 0
                ? detail.map((item) => ({
                    color: item.color,
                    price: item.price,
                    productName: item.name,
                    productVariantId: item.productVariantId,
                    quantity: item.amount,
                }))
                : [];
        createOrderForUser({
            data: {
                addressId: '7989395405864960',
                email: orderDetailCommon?.email,
                paymentMethod: orderDetailCommon?.paymentMethod,
                receiver: orderDetailCommon?.receiver,
                note: orderDetailCommon?.note,
                listOrderProduct: array2,
            },
            onCompleted: () => {
                onCancel();
                showSucsessMessage('Mua lại thành công');
            },
            onError: ({ response }) => {
                showErrorMessage('Mua lại thất bại');
                onCancel();
            },
        });
        setActive(1);
    };
    const handleRateChange = (value) => {
        setStar(value);
    };
    return (
        // <Modal
        //     centered
        //     open={open}
        //     onCancel={onCancel}
        //     footer={null}
        //     title={translate.formatMessage(messages.objectName)}
        //     width={900}
        //     bodyStyle={{ height: 'max-content', maxHeight: '70vh', overflowY: 'auto', overflowX: 'hidden' }}
        // >
        <BaseForm form={form} onFinish={handleCreateReview} size="100%">
            <Space
                direction="vertical"
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Space size={'large'} direction="vertical">
                    <Divider orientation="left" style={{ fontSize: 20 }}>
                        Thông tin khách hàng
                    </Divider>
                    {/* <Card
                                    style={{
                                        minWidth: 900,
                                        backgroundColor: 'transparent',
                                        border: '1px dotted gray',
                                        padding: '30px',
                                    }}
                                > */}
                    <Card
                        style={{
                            minWidth: 800,
                            backgroundColor: 'transparent',
                            border: '1px dotted gray',
                            borderRadius: 10,
                            marginTop: '-20px',
                        }}
                    >
                        <Col span={24}>
                            <Space direction="vertical">
                                <Space>
                                    <Typography.Title style={{ fontSize: 14, marginTop: 7 }}>
                                        Họ và tên:
                                    </Typography.Title>
                                    <Typography.Text>{orderDetailCommon?.receiver}</Typography.Text>
                                </Space>
                                <Space>
                                    <Typography.Title style={{ fontSize: 14, marginTop: 7 }}>
                                        Số điện thoại:
                                    </Typography.Title>
                                    <Typography.Text>{orderDetailCommon?.phone}</Typography.Text>
                                </Space>
                                <Space>
                                    <Typography.Title style={{ fontSize: 14, marginTop: 7 }}>
                                        Ngày đặt:
                                    </Typography.Title>
                                    <Typography.Text>{orderDetailCommon?.createdDate}</Typography.Text>
                                </Space>
                                <Space>
                                    <Typography.Title style={{ fontSize: 14, marginTop: 7 }}>
                                        Hình thức thanh toán:
                                    </Typography.Title>
                                    <Typography.Text>
                                        {/* {renderPaymentStatusTag(dataReciver?.paymentMethod, true)} */}
                                    </Typography.Text>
                                </Space>
                                <Space>
                                    <Typography.Title style={{ fontSize: 14, marginTop: 7 }}>
                                        Trạng thái đơn hàng:
                                    </Typography.Title>
                                    <Typography.Text>
                                        {/* {renderPaymentStatusTag(dataReciver?.state, false)} */}
                                    </Typography.Text>
                                </Space>
                            </Space>
                        </Col>
                    </Card>
                    {/* </Card> */}
                </Space>
                <Space size={'large'} style={{ minHeight: 300 }} direction="vertical">
                    <Divider orientation="left" style={{ fontSize: 20 }}>
                        Thông tin đơn hàng
                    </Divider>
                    <List
                        className="demo-loadmore-list"
                        itemLayout="horizontal"
                        dataSource={detail}
                        style={{ marginBottom: 10, minWidth: 800, marginTop: '-30px' }}
                        renderItem={(item) => (
                            <Card style={{ backgroundColor: '#eff0f1', marginTop: 10 }}>
                                <List.Item key={item?.id}>
                                    <List.Item.Meta
                                        avatar={<Avatar src={item?.image} size={100} />}
                                        title={
                                            <a style={{ fontSize: 25 }} href={`/detail/${item?.productId}`}>
                                                {item?.name}
                                            </a>
                                        }
                                        // description={item?.price}
                                        description={
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    flexDirection: 'column',
                                                }}
                                            >
                                                <div style={{ flex: '1', justifyContent: 'center' }}>
                                                    Số lượng: {item?.amount}
                                                </div>
                                                <div style={{ flex: '1', justifyContent: 'center' }}>
                                                    Màu: {item?.color}
                                                </div>
                                                <div
                                                    style={{
                                                        flex: '1',
                                                        justifyContent: 'center',
                                                        fontSize: 20,
                                                    }}
                                                >
                                                    {' '}
                                                    Tổng tiền:{' '}
                                                    {formatMoney(item?.price, {
                                                        groupSeparator: ',',
                                                        decimalSeparator: '.',
                                                        currentcy: 'đ',
                                                        currentcyPosition: 'BACK',
                                                        currentDecimal: '0',
                                                    })}
                                                </div>
                                            </div>
                                        }
                                    />
                                </List.Item>
                            </Card>
                        )}
                    />
                </Space>
            </Space>
            <Row>
                <Button size="large" key="submit" type="primary" htmlType="submit" style={{ width: '100%' }}>
                    {translate.formatMessage(messages.buyAgain)}
                </Button>
            </Row>
        </BaseForm>
        // </Modal>
    );
};

export default BuyAgainModal;
