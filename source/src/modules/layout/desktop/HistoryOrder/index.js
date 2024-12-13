/* eslint-disable indent */
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './OrderPage.scss';
// import { fetchAsyncProductSingle, getProductSingle, getSingleProductStatus } from '../../store/productSlice';
// import { addToCart, getCartMessageStatus, setCartMessageOff, setCartMessageOn } from '../../store/cartSlice';
// import CartMessage from '../../components/CartMessage/CartMessage';
import { DeleteOutlined } from '@ant-design/icons';
import PageWrapper from '@components/common/layout/PageWrapper';
import { DATE_FORMAT_VALUE, DEFAULT_FORMAT, paymentOptions, paymentSelect } from '@constants';
import apiConfig from '@constants/apiConfig';
import { paidValues } from '@constants/masterData';
import useAuth from '@hooks/useAuth';
import useDisclosure from '@hooks/useDisclosure';
import useFetch from '@hooks/useFetch';
import useTranslate from '@hooks/useTranslate';
import { convertUtcToLocalTime, formatMoney } from '@utils';
import { Button, Card, Form, Modal, Table, Tabs, Tag, Tooltip, theme } from 'antd';
import { defineMessage } from 'react-intl';
import ListOrderModal from './ListOrderModal';
import Container from '@components/common/elements/Container';
import styles from './index.module.scss';
import useQueryParams from '@hooks/useQueryParams';

const decription = defineMessage({
    first: 'Kiểm tra số lượng sản phẩm',
    second: 'Thanh toán đơn hàng',
    third: 'Hoàn thành các bước',
});

const HistoryOrderPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const queryParameters = new URLSearchParams(window.location.search);
    const [ form ] = Form.useForm();
    const translate = useTranslate();
    const stateValues = translate.formatKeys(paymentOptions, [ 'label' ]);

    const { token } = theme.useToken();
    const { setQueryParams } = useQueryParams();

    const steps = [
        {
            label: `Đang Xử Lý`,
            key: 1,
            children: <TableMyOrder state={1} />,
        },
        {
            label: `Đã được duyệt`,
            key: 2,
            children: <TableMyOrder state={2} />,
        },
        {
            label: `Hoàn Thành`,
            key: 4,
            children: <TableMyOrder state={4} />,
        },
        {
            label: `Đã Hủy`,
            key: 3,
            children: <TableMyOrder state={3} />,
        },
    ];
    const items = steps.map((item) => ({
        label: item.label,
        key: item.key,
        children: item.children,
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
                routes={[ { breadcrumbName: 'Lịch sử đơn hàng' } ]}
                // title={title}
                style={{ backgroundColor: '#282a36' }}
            >
                <div style={{ flex: '1', justifyContent: 'center', minHeight: 600 }}>
                    <Card style={{ minHeight: 600, backgroundColor: '#d8dadd' }}>
                        <Tabs
                            defaultActiveKey="1"
                            centered
                            size="large"
                            items={items}
                            style={{ marginBottom: 20 }}
                            onChange={(value) => {
                                setQueryParams({ state: value });
                            }}
                        />
                    </Card>
                </div>
            </PageWrapper>
        </Container>
    );
};

function TableMyOrder() {
    const translate = useTranslate();
    const stateValues = translate.formatKeys(paymentOptions, [ 'label' ]);
    const [ form ] = Form.useForm();
    const [ openedDetailsModal, handlerDetailsModal ] = useDisclosure(false);
    const [ orderDetailProdcut, setOrderDetailProdcut ] = useState([]);
    const [ dataOrder, setDataOrder ] = useState({});
    const isPaidValues = translate.formatKeys(paidValues, [ 'label' ]);
    const [ orderId, setOrderId ] = useState(null);
    const queryParameters = new URLSearchParams(window.location.search);
    const state = queryParameters.get('state');

    const { data: myOrder, execute: executeMyOrder } = useFetch(apiConfig.order.myOrder, {
        immediate: false,
        mappingData: ({ data }) => data.content,
    });
    const { execute: executeDetailOrder } = useFetch({
        ...apiConfig.orderDetail.getByOrder,
    });
    useEffect(() => {
        executeMyOrder({
            params: { state: state || 1 },
        });
    }, [ state ]);

    const handleFetchDetail = (record) => {
        executeDetailOrder({
            pathParams: { id: record.id },
            onCompleted: (response) => {
                setOrderDetailProdcut(response.data);
                setDataOrder(record);
            },
        });
    };

    const { execute: excuteCancelOrder } = useFetch({
        ...apiConfig.order.cancelMyOrder,
    });

    const showDeleteItemConfirm = (id) => {
        Modal.confirm({
            title: 'Hủy đơn hàng',
            content: 'Bạn có chắc muốn hủy đơn hàng?',
            okText: 'Xác nhận',
            cancelText: 'Đóng',
            centered: true,
            onOk: () => {
                handleCancelOrder(id);
            },
        });
    };

    const handleCancelOrder = (id) => {
        excuteCancelOrder({
            data: { id: id, state: 3 },
            onCompleted: (response) => {
                executeMyOrder({
                    params: { state },
                });
            },
            // onError: mixinFuncs.handleGetDetailError,
        });
    };

    const itemHeader = () => {
        const items = [
            {
                title: 'Mã đơn hàng',
                dataIndex: 'orderCode',
                align: 'center',
            },
            {
                title: 'Ngày đặt',
                dataIndex: 'createdDate',
                align: 'center',
                with: 200,
                render: (createdDate) => {
                    const result = convertUtcToLocalTime(createdDate, DEFAULT_FORMAT, DATE_FORMAT_VALUE);
                    return <div>{result}</div>;
                },
            },
            {
                title: 'Người nhận',
                dataIndex: 'receiver',
                align: 'center',
            },
            {
                title: 'Phương thức thanh toán',
                dataIndex: 'paymentMethod',
                align: 'center',
                width: 120,
                render(dataRow) {
                    const state = stateValues.find((item) => item.value == dataRow);
                    return (
                        <Tag color={state.color} style={{ width: 65, display: 'flex', justifyContent: 'center' }}>
                            <div style={{ padding: '0 4px', fontSize: 14 }}>{state.label}</div>
                        </Tag>
                    );
                },
            },
            {
                title: 'Trạng thái thanh toán',
                dataIndex: 'isPaid',
                align: 'center',
                width: 120,
                render(dataRow) {
                    const state = isPaidValues.find((item) => item.value == dataRow);
                    return (
                        <Tag color={state.color} style={{ width: 110, display: 'flex', justifyContent: 'center' }}>
                            <div style={{ padding: '0 4px', fontSize: 14 }}>{state.label}</div>
                        </Tag>
                    );
                },
            },
            {
                title: 'Tổng tiền',
                dataIndex: [ 'totalMoney' ],
                name: 'totalMoney',
                align: 'center',
                render: (value) => {
                    return (
                        <span>
                            {formatMoney(value, {
                                groupSeparator: ',',
                                decimalSeparator: '.',
                                currentcy: 'đ',
                                currentcyPosition: 'BACK',
                                currentDecimal: '0',
                            })}
                        </span>
                    );
                },
            },
        ];
        if (state == 1) {
            items.push({
                title: 'Hủy đơn hàng',
                key: 'action',
                align: 'center',
                render: (_, record) => (
                    <Button
                        style={{ color: 'red', fontSize: 16 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            showDeleteItemConfirm(record.id);
                        }}
                    >
                        Hủy
                    </Button>
                ),
            });
        }
        if (state == 2) {
            items.push({
                title: 'Ngày dự kiến giao hàng',
                dataIndex: 'expectedDeliveryDate',
                align: 'center',
                width: 200,
                render: (expectedDeliveryDate) => {
                    const result = convertUtcToLocalTime(expectedDeliveryDate, DEFAULT_FORMAT, DATE_FORMAT_VALUE);
                    return <div>{result}</div>;
                },
            });
        }
        return items;
    };

    return (
        <div>
            <ListOrderModal
                open={openedDetailsModal}
                handlerDetailsModal={handlerDetailsModal}
                onCancel={() => handlerDetailsModal.close()}
                form={form}
                detail={orderDetailProdcut}
                isEditing={!!orderDetailProdcut}
                state={state}
                orderDetailCommon={dataOrder}
                orderId={orderId}
            />
            <Table
                pagination={true}
                onRow={(record, rowIndex) => ({
                    onClick: (e) => {
                        setOrderId(record.id);
                        e.stopPropagation();
                        handleFetchDetail(record);
                        handlerDetailsModal.open();
                    },
                })}
                columns={itemHeader()}
                dataSource={myOrder}
                bordered
                style={{ cursor: 'pointer' }}
            ></Table>
        </div>
    );
}

export default HistoryOrderPage;
