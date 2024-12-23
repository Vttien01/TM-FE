/* eslint-disable indent */
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { generatePath, useNavigate } from 'react-router-dom';
import './OrderPage.scss';
// import { fetchAsyncProductSingle, getProductSingle, getSingleProductStatus } from '../../store/productSlice';
// import { addToCart, getCartMessageStatus, setCartMessageOff, setCartMessageOn } from '../../store/cartSlice';
// import CartMessage from '../../components/CartMessage/CartMessage';
import { SearchOutlined } from '@ant-design/icons';
import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import { orderStateOption } from '@constants/masterData';
import useAuth from '@hooks/useAuth';
import useDisclosure from '@hooks/useDisclosure';
import useFetch from '@hooks/useFetch';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import { IconEdit } from '@tabler/icons-react';
import { formatMoney } from '@utils';
import {
    Button,
    Card,
    Col,
    Divider,
    Form,
    Input,
    List,
    Result,
    Row,
    Space,
    Tabs,
    Tag,
    Timeline,
    Typography,
    theme,
} from 'antd';
import Avatar from 'antd/es/avatar/avatar';
import { defineMessage } from 'react-intl';
import ListDetailsForm from './ListOrderModal';
import { showErrorMessage } from '@services/notifyService';
import { SmileOutlined } from '@ant-design/icons';
import { paymentSelect } from '@constants';
import Container from '@components/common/elements/Container';
import styles from './index.module.scss';

const decription = defineMessage({
    first: 'Kiểm tra số lượng sản phẩm',
    second: 'Thanh toán đơn hàng',
    third: 'Hoàn thành các bước',
});

const HistoryOrderGuest = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const queryParameters = new URLSearchParams(window.location.search);
    const [ form ] = Form.useForm();
    const translate = useTranslate();
    const [ item1, setItem1 ] = useState(null);
    const [ orderId, setOrderId ] = useState(0);
    const [ search, setSearch ] = useState('');
    const [ checkSearch, setCheckSearch ] = useState(false);
    const [ dataReciver, setDataReciver ] = useState({});
    // const stateValues = translate.formatKeys(paymentSelect, [ 'label' ]);
    const orderStatetateValues = translate.formatKeys(orderStateOption, [ 'label' ]);

    const { data: myOrder, execute: executeSearchOrder } = useFetch({
        ...apiConfig.orderDetail.getByPhoneAndOrder,
    });

    function processString(value) {
        // Sử dụng biểu thức chính quy để loại bỏ kí tự không phải chữ cái
        const processedValue = value.replace(/[^a-zA-Z0-9]/g, '');

        // processedValue giờ chỉ chứa các kí tự chữ cái từ a đến z hoặc A đến Z
        return processedValue;
    }

    const onSearch = (value, _e, info) => {
        const output = processString(value.orderCode);
        // setSearch(value.orderCode);
        if (output !== '') {
            executeSearchOrder({
                params: { orderCode: output },
                onCompleted: (response) => {
                    // console.log(response.data.content);
                    if (response !== null) {
                        setCheckSearch(true);
                        setDataReciver(response.data.orderDto);
                        setSearch(response.data.content);
                    } else {
                        setCheckSearch(false);
                    }
                },
                onError: (error) => {
                    showErrorMessage(error.message);
                },
            });
        } else setCheckSearch(false);
    };

    const { token } = theme.useToken();
    const [ current, setCurrent ] = useState(0);

    const [ quantity, setQuantity ] = useState(1);

    const steps = [
        {
            label: `Chi tiết đơn hàng`,
            key: 1,
            children: checkSearch ? (
                <TableMyOrder search={myOrder} />
            ) : (
                <Result
                    icon={<SearchOutlined />}
                    title="Vui lòng nhập mã đơn hàng!"
                    extra={
                        <Button type="primary">
                            <a href="/">Quay về trang chủ</a>
                        </Button>
                    }
                />
            ),
        },
    ];
    const items = steps.map((item) => ({
        label: item.label,
        key: item.key,
        children: item.children,
    }));

    const renderPaymentStatusTag = (value, check) => {
        let state;
        if (check) {
            state = paymentSelect.find((item) => item.value == value);
        } else {
            state = orderStatetateValues.find((item) => item.value == value);
        }
        return (
            <Tag
                color={state?.color}
                style={{ minWidth: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                <div style={{ padding: '3px 0px 3px 0px', fontSize: 14 }}>{state?.label}</div>
            </Tag>
        );
    };

    return (
        <Container className={styles.container}>
            <PageWrapper routes={[ { breadcrumbName: 'Tìm kiếm đơn hàng' } ]} style={{ backgroundColor: '#282a36' }}>
                <div
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        maxWidth: '100%',
                    }}
                >
                    <div style={{ flex: '1', justifyContent: 'center' }}>
                        <Form onFinish={onSearch}>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <Form.Item name="orderCode" contentWrapperStyle={{ width: 800 }}>
                                    <Input placeholder="Nhập mã đơn hàng ..." style={{ minWidth: 500 }} />
                                </Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    style={{ marginLeft: 8, backgroundColor: '#f57e20', height: 42 }}
                                >
                                    Tìm kiếm
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>
                <Card style={{ minHeight: 600, backgroundColor: '#d8dadd', margin: '0px 20px' }}>
                    {checkSearch ? (
                        <Space
                            direction="vertical"
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Space size={'large'} style={{ minHeight: 350 }} direction="vertical">
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
                                <Row
                                    style={{
                                        minWidth: 900,
                                        backgroundColor: 'transparent',
                                        border: '1px dotted gray',
                                        padding: '40px 30px 0px',
                                        borderRadius: 10,
                                    }}
                                >
                                    <Col span={12}>
                                        <Space direction="vertical">
                                            <Space>
                                                <Typography.Title style={{ fontSize: 14, marginTop: 7 }}>
                                                    Họ và tên:
                                                </Typography.Title>
                                                <Typography.Text>{dataReciver?.receiver}</Typography.Text>
                                            </Space>
                                            <Space>
                                                <Typography.Title style={{ fontSize: 14, marginTop: 7 }}>
                                                    Số điện thoại:
                                                </Typography.Title>
                                                <Typography.Text>{dataReciver?.phone}</Typography.Text>
                                            </Space>
                                            <Space>
                                                <Typography.Title style={{ fontSize: 14, marginTop: 7 }}>
                                                    Ngày đặt:
                                                </Typography.Title>
                                                <Typography.Text>{dataReciver?.createdDate}</Typography.Text>
                                            </Space>
                                            <Space>
                                                <Typography.Title style={{ fontSize: 14, marginTop: 7 }}>
                                                    Hình thức thanh toán:
                                                </Typography.Title>
                                                <Typography.Text>
                                                    {renderPaymentStatusTag(dataReciver?.paymentMethod, true)}
                                                </Typography.Text>
                                            </Space>
                                            <Space>
                                                <Typography.Title style={{ fontSize: 14, marginTop: 7 }}>
                                                    Trạng thái đơn hàng:
                                                </Typography.Title>
                                                <Typography.Text>
                                                    {renderPaymentStatusTag(dataReciver?.state, false)}
                                                </Typography.Text>
                                            </Space>
                                        </Space>
                                    </Col>
                                    <Col
                                        span={12}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Timeline
                                            className={styles.timeline}
                                            items={[
                                                {
                                                    color: 'green',
                                                    children: `Đặt hàng vào ${dataReciver?.createdDate}`,
                                                },
                                                {
                                                    color: 'green',
                                                    children: 'Thanh toán',
                                                },
                                                {
                                                    color: 'green',
                                                    children: 'Đặt hàng thành công',
                                                },
                                                {
                                                    color: 'green',
                                                    children: 'Đơn hàng đang được xử lý',
                                                },
                                                {
                                                    color: 'gray',
                                                    children: 'Đơn hàng được duyệt',
                                                },
                                                {
                                                    color: '#00CCFF',
                                                    // dot: <SmileOutlined />,
                                                    children: <p>Hoàn thành</p>,
                                                },
                                            ]}
                                        />
                                    </Col>
                                </Row>
                                {/* </Card> */}
                            </Space>
                            <Space size={'large'} style={{ minHeight: 300 }} direction="vertical">
                                <Divider orientation="left" style={{ fontSize: 20 }}>
                                    Thông tin đơn hàng
                                </Divider>
                                <TableMyOrder search={myOrder} />
                            </Space>
                        </Space>
                    ) : (
                        <Result
                            icon={<SearchOutlined />}
                            title="Vui lòng nhập mã đơn hàng!"
                            extra={
                                <Button type="primary">
                                    <a href="/">Quay về trang chủ</a>
                                </Button>
                            }
                        />
                    )}
                </Card>
            </PageWrapper>
        </Container>
    );
};

function TableMyOrder({ search }) {
    const [ form ] = Form.useForm();
    const [ openedDetailsModal, handlerDetailsModal ] = useDisclosure(false);
    const [ detail, setDetail ] = useState([]);

    return (
        <div>
            <ListDetailsForm
                open={openedDetailsModal}
                onCancel={() => handlerDetailsModal.close()}
                form={form}
                detail={detail}
                isEditing={!!detail}
            />
            <Card>
                <List
                    className="demo-loadmore-list"
                    itemLayout="horizontal"
                    dataSource={search.data.content}
                    style={{ marginBottom: 10, minWidth: 900 }}
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
                                            <div style={{ flex: '1', justifyContent: 'center', fontSize: 20 }}>
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
            </Card>
        </div>
    );
}

export default HistoryOrderGuest;
