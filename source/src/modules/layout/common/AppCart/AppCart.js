/* eslint-disable indent */
import { ShoppingCartOutlined } from '@ant-design/icons';
import AutoCompleteField from '@components/common/form/AutoCompleteField';
import SelectField from '@components/common/form/SelectField';
import { apiFrontend, paymentSelect } from '@constants';
import apiConfig from '@constants/apiConfig';
import useAuth from '@hooks/useAuth';
import useFetch from '@hooks/useFetch';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import { showErrorMessage, showSucsessMessage } from '@services/notifyService';
import { IconMinus, IconPlus, IconTrash } from '@tabler/icons-react';
import { fetchCartItems, formatMoney } from '@utils';
import { Badge, Button, Checkbox, Drawer, Flex, Form, Input, Modal, Table, Tag, Tooltip, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { defineMessage } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';
import './AppCart.scss';
import useShoppingCart from '@hooks/useShoppingCart';
import { useDispatch, useSelector } from 'react-redux';
import { getCacheAccessToken } from '@services/userService';
import { getCartItemList } from '@store/actions/cart';
const { Text } = Typography;

const decription = defineMessage({
    first: 'Kiểm tra số lượng sản phẩm',
    second: 'Thanh toán đơn hàng',
    third: 'Hoàn thành các bước',
});

const AppCart = () => {
    const { profile } = useAuth();
    const navigate = useNavigate();
    const translate = useTranslate();

    const [ CartDrawer, setCartDrawer ] = useState(false);
    const [ checkoutDrawerOpen, setCheckoutDrawerOpen ] = useState(false);
    const [ cartItem, setCartItem ] = useState([]);
    const [ check, setCheck ] = useState(false);
    const cart = useSelector((state) => state.cart.cart);
    const { removeItemCart } = useShoppingCart();
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const userAccessToken = getCacheAccessToken();
    const dispatch = useDispatch();

    const { loading: loadingOrderForGuest, execute: createOrderForGuest } = useFetch(apiConfig.order.create, {
        immediate: false,
    });
    const location = useLocation();
    useEffect(() => {
        setCartItem(userAccessToken ? cart : storedCart);
    }, [ userAccessToken, location.pathname, cart ]);

    const { execute: createTransaction } = useFetch({
        ...apiConfig.transaction.create,
    });

    const { execute: createTransactionVnpal } = useFetch(apiConfig.transaction.vnpay, {
        immediate: false,
    });

    const { execute: executeDeleteCart } = useFetch({
        ...apiConfig.cart.delete,
    });

    const removeFromCart = (productId) => {
        const updatedCart = cartItem.filter((item) => item.variantId !== productId);
        dispatch(getCartItemList(updatedCart));
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        setCheck(!check);
    };

    const showConfirmBuyOrder = (message, match, matchName) => {
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
                                console.log(cartItem, match, matchName);
                                let updatedCartItem;
                                if (Number(match) === 0) {
                                    // Xóa sản phẩm nếu match === 0
                                    updatedCartItem = cartItem.filter((item) => item.productName !== matchName);
                                } else {
                                    // Cập nhật quantity nếu match > 0
                                    updatedCartItem = cartItem.map((item) => {
                                        if (item.productName === matchName) {
                                            return {
                                                ...item,
                                                quantity: Number(match),
                                            };
                                        }
                                        return item;
                                    });
                                }
                                setCartItem(updatedCartItem);
                                localStorage.setItem('cart', JSON.stringify(updatedCartItem));
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
        let array2 = new Array(cartItem.length).fill(null);

        array2 = cartItem.map((item) => ({
            color: item.color,
            price: item.price,
            productName: item.productName,
            productVariantId: item.variantId,
            quantity: item.quantity,
        }));
        const updatedValues = {
            ...values,
            listOrderProduct: array2, // Thay yourListOrderProductArray bằng mảng thực tế của bạn
        };

        createOrderForGuest({
            data: { ...updatedValues },
            onCompleted: (respone) => {
                dispatch(getCartItemList([]));
                localStorage.removeItem('cart');
                if (values.paymentMethod === 1) {
                    createTransaction({
                        data: {
                            orderId: respone.data.orderId,
                            urlCancel: `${apiFrontend}my-order-fail`,
                            urlSuccess: `${apiFrontend}my-order-success`,
                        },
                        onCompleted: (res) => {
                            window.location.href = res.data;
                            showSucsessMessage('Đặt hàng thành công');
                        },
                        onError: () => {
                            // localStorage.removeItem('cart');
                            showErrorMessage('Thanh toán thất bại!');
                            // setTimeout(() => {
                            //     window.location.reload();
                            // }, 1800);
                        },
                    });
                } else if (values.paymentMethod == 2) {
                    createTransactionVnpal({
                        data: {
                            orderId: respone.data.orderId,
                            urlCancel: `${apiFrontend}my-order-fail`,
                            urlSuccess: `${apiFrontend}my-order-success`,
                        },
                        onCompleted: (res) => {
                            window.location.href = res.data.paymentUrl;
                            // setCurrent(1);
                            showSucsessMessage('Đơn hàng đang được xử lý!');
                        },
                        onError: () => {
                            showErrorMessage('Thanh toán VNPAY thất bại');
                            // setCurrent(1);
                        },
                    });
                } else {
                    localStorage.clear();
                    setCheckoutDrawerOpen(false);
                    showSucsessMessage('Đặt hàng thành công');
                    // setTimeout(() => {
                    //     window.location.reload();
                    // }, 1800);
                }
            },
            onError: (error) => {
                setCheckoutDrawerOpen(false);
                if (error.code === 'ERROR-PRODUCT-VARIANT-0001') {
                    const regex = /Sản phẩm (.+?) hiện/;
                    const matchName = error?.message.match(regex);
                    // showErrorMessage(error.message);
                    const match = error?.message.match(/hiện chỉ còn (\d+)/);
                    showConfirmBuyOrder(error.message, match ? match[1] : '0', matchName ? matchName[1] : '');
                } else {
                    showErrorMessage('Đặt hàng thất bại');
                }
            },
        });
        // message.success('Đặt hàng thành công');
    }

    const QuantityComponent = ({ value, record }) => {
        const [ isInitialRender, setIsInitialRender ] = useState(true);
        const [ quantity, setQuantity ] = useState(record.quantity);
        const [ triggerEffect, setTriggerEffect ] = useState(false);
        const { execute: executeUpdateCart } = useFetch({
            ...apiConfig.cart.update,
        });
        const increaseQty = () => {
            setQuantity((prevQty) => {
                setTriggerEffect(!triggerEffect);
                let tempQty = prevQty + 1;
                return tempQty;
            });
        };

        const decreaseQty = () => {
            setQuantity((prevQty) => {
                setTriggerEffect(!triggerEffect);
                let tempQty = prevQty - 1;
                if (tempQty < 1) tempQty = 1;
                return tempQty;
            });
        };

        useEffect(() => {
            if (isInitialRender) {
                setIsInitialRender(false);
                return;
            }
            const updatedCart = cartItem.map((item) => {
                if (item.variantId === record.variantId) {
                    return {
                        ...item,
                        quantity: quantity,
                        totalPriceSell: record.price * quantity,
                    };
                }
                return item;
            });
            if (profile) {
                executeUpdateCart({
                    data: {
                        cartDetails: updatedCart,
                    },
                    onCompleted: (respone) => {
                        dispatch(getCartItemList(updatedCart));
                        setCartItem(updatedCart);
                        setCheck(!check);
                    },
                    onError: (error) => {
                        console.log(error);
                    },
                });
            } else {
                setCartItem(updatedCart);
                localStorage.setItem('cart', JSON.stringify(updatedCart));
            }
        }, [ triggerEffect ]);

        return (
            <Flex align="center" gap={10}>
                <button
                    type="button"
                    className="qty-decrease flex align-center justify-center"
                    onClick={() => decreaseQty(record)}
                >
                    <i className="fas fa-minus"></i>
                    <IconMinus />
                </button>

                <div style={{ width: 'max-content', padding: '0 10px' }}>{quantity}</div>

                <button
                    type="button"
                    className="qty-increase flex align-center justify-center"
                    onClick={() => increaseQty(record)}
                >
                    <i className="fas fa-plus"></i>
                    <IconPlus />
                </button>
            </Flex>
        );
    };
    const [ selectedData, setSelectedData ] = useState();
    const rowSelection = {
        onChange: (newSelectedRowKeys, selectedRows) => {
            setSelectedData(selectedRows);
        },
    };

    const handleOrder = () => {
        if (profile) {
            navigate(routes.OderPage.path);
        } else {
            setCheckoutDrawerOpen(true);
        }
        setCartDrawer(false);
    };

    return (
        <div>
            <Badge
                onClick={() => {
                    setCartDrawer(true);
                }}
                count={cartItem?.length}
                className="ShopingCartIcon"
            >
                <Tooltip title="Giỏ hàng">
                    <ShoppingCartOutlined style={{ fontSize: 28, color: '#f57e20' }} />
                </Tooltip>
            </Badge>
            <Drawer
                open={CartDrawer}
                onClose={() => {
                    setCartDrawer(false);
                }}
                title="Giỏ hàng"
                contentWrapperStyle={{ width: 'max-content' }}
            >
                {profile ? (
                    <Table
                        // rowSelection={rowSelection}
                        pagination={false}
                        columns={[
                            {
                                title: 'Tên sản phẩm',
                                dataIndex: 'productName',
                                align: 'center',
                                width: 200,
                            },
                            {
                                title: 'Màu sắc',
                                dataIndex: [ 'color' ],
                                align: 'center',
                            },
                            {
                                title: 'Giá',
                                dataIndex: [ 'price' ],
                                name: 'price',
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
                            {
                                title: 'Số lượng',
                                dataIndex: 'quantity',
                                align: 'center',
                                width: 100,
                                render: (value, record) => <QuantityComponent value={value} record={record} />,
                            },
                            {
                                title: 'Tổng',
                                dataIndex: 'totalPriceSell',
                                align: 'center',
                                render: (value) => {
                                    return (
                                        <>
                                            {formatMoney(value, {
                                                groupSeparator: ',',
                                                decimalSeparator: '.',
                                                currentcy: 'đ',
                                                currentcyPosition: 'BACK',
                                                currentDecimal: '0',
                                            })}
                                        </>
                                    );
                                },
                            },
                            {
                                title: 'Hành động',
                                key: 'action',
                                align: 'center',
                                render: (_, record) => (
                                    <Tooltip title="Xóa giỏ hàng">
                                        <Button
                                            style={{
                                                padding: 3,
                                                display: 'table-cell',
                                                verticalAlign: 'middle',
                                                backgroundColor: '#e70d0d',
                                                fontWeight: 600,
                                                color: 'white',
                                                fontSize: 12,
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeItemCart(record);
                                            }}
                                        >
                                            <IconTrash />
                                        </Button>
                                    </Tooltip>
                                ),
                            },
                        ]}
                        dataSource={cartItem}
                        rowKey={(record) => record.variantId}
                        summary={(data) => {
                            const total = data.reduce((pre, current) => {
                                return pre + current.totalPriceSell;
                            }, 0);
                            return (
                                <Table.Summary.Row>
                                    <Table.Summary.Cell index={0} colSpan={4} align="end">
                                        <Tag color={'green'} style={{ fontSize: 18, fontWeight: 700 }}>
                                            Tổng trả
                                        </Tag>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={1}>
                                        <Text type="danger" style={{ fontWeight: 700 }}>
                                            {formatMoney(total, {
                                                groupSeparator: ',',
                                                decimalSeparator: '.',
                                                currentcy: 'đ',
                                                currentcyPosition: 'BACK',
                                                currentDecimal: '0',
                                            })}
                                        </Text>
                                    </Table.Summary.Cell>
                                </Table.Summary.Row>
                            );
                        }}
                    ></Table>
                ) : (
                    <Table
                        pagination={false}
                        rowKey={(record) => record.variantId}
                        columns={[
                            {
                                title: 'Tên sản phẩm',
                                dataIndex: 'productName',
                                align: 'center',
                                width: 200,
                            },
                            {
                                title: 'Màu sắc',
                                dataIndex: 'color',
                                align: 'center',
                            },
                            {
                                title: 'Giá',
                                dataIndex: 'price',
                                name: 'price',
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
                            {
                                title: 'Số lượng',
                                dataIndex: 'quantity',
                                align: 'center',
                                render: (value, record) => <QuantityComponent value={value} record={record} />,
                            },
                            {
                                title: 'Tổng',
                                dataIndex: 'totalPriceSell',
                                align: 'center',
                                render: (value) => {
                                    return (
                                        <>
                                            {formatMoney(value, {
                                                groupSeparator: ',',
                                                decimalSeparator: '.',
                                                currentcy: 'đ',
                                                currentcyPosition: 'BACK',
                                                currentDecimal: '0',
                                            })}
                                        </>
                                    );
                                },
                            },
                            {
                                title: 'Hành động',
                                key: 'action',
                                align: 'center',
                                render: (_, record) => (
                                    <Tooltip title="Xóa giỏ hàng">
                                        <Button
                                            style={{
                                                padding: 3,
                                                display: 'table-cell',
                                                verticalAlign: 'middle',
                                                backgroundColor: '#e70d0d',
                                                fontWeight: 600,
                                                color: 'white',
                                                fontSize: 12,
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeFromCart(record.variantId);
                                            }}
                                        >
                                            <IconTrash />
                                        </Button>
                                    </Tooltip>
                                ),
                            },
                        ]}
                        dataSource={cartItem}
                        summary={(data) => {
                            const total = data.reduce((pre, current) => {
                                return pre + current.totalPriceSell;
                            }, 0);
                            return (
                                <Table.Summary.Row>
                                    <Table.Summary.Cell index={0} colSpan={4} align="end">
                                        <Tag color={'green'} style={{ fontSize: 18, fontWeight: 700 }}>
                                            Tổng trả
                                        </Tag>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={1}>
                                        <Text type="danger" style={{ fontWeight: 700 }}>
                                            {formatMoney(total, {
                                                groupSeparator: ',',
                                                decimalSeparator: '.',
                                                currentcy: 'đ',
                                                currentcyPosition: 'BACK',
                                                currentDecimal: '0',
                                            })}
                                        </Text>
                                    </Table.Summary.Cell>
                                </Table.Summary.Row>
                            );
                        }}
                    ></Table>
                )}

                {cartItem?.length > 0 ? (
                    <Button
                        type="primary"
                        style={{ marginTop: 20 }}
                        onClick={() => {
                            handleOrder();
                        }}
                    >
                        Đặt hàng
                    </Button>
                ) : (
                    <Button
                        type="primary"
                        style={{ marginTop: 20 }}
                        onClick={() => {
                            navigate(routes.homePage.path);
                            setCartDrawer(false);
                        }}
                    >
                        Thêm giỏ hàng
                    </Button>
                )}
            </Drawer>
            <Drawer
                open={checkoutDrawerOpen}
                onClose={() => {
                    setCheckoutDrawerOpen(false);
                }}
                title="Đặt hàng"
                contentWrapperStyle={{ width: 650 }}
            >
                <Form
                    onFinish={onConfirmOrder}
                    labelCol={{
                        span: 7,
                    }}
                    wrapperCol={{
                        span: 18,
                    }}
                    layout="horizontal"
                    style={{
                        maxWidth: 600,
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
                                message: 'Vui lòng điền địa chỉ',
                            },
                        ]}
                        label="Địa chỉ"
                        name="address"
                    >
                        <Input placeholder="Nhập địa chỉ ..." />
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

                    <Form.Item label="Ghi chú" name="note">
                        <Input placeholder="Nhập ghi chú ..." />
                    </Form.Item>
                    {/* <Form.Item labelAlign="right" label="Mã giảm giá" name="voucherId">
                        <Input placeholder="Nhập mã giảm giá ..." />
                    </Form.Item> */}
                    <AutoCompleteField
                        label="Tỉnh"
                        name="province"
                        apiConfig={apiConfig.nation.autocomplete}
                        mappingOptions={(item) => ({ value: item.name, label: item.name })}
                        initialSearchParams={{ kind: 1 }}
                        searchParams={(text) => ({ name: text, kind: 1 })}
                        required
                    />
                    <AutoCompleteField
                        label="Quận"
                        name="district"
                        apiConfig={apiConfig.nation.autocomplete}
                        mappingOptions={(item) => ({ value: item.name, label: item.name })}
                        initialSearchParams={{ kind: 2 }}
                        searchParams={(text) => ({ name: text, kind: 2 })}
                        required
                    />
                    <AutoCompleteField
                        label="Huyện"
                        name="ward"
                        apiConfig={apiConfig.nation.autocomplete}
                        mappingOptions={(item) => ({ value: item.name, label: item.name })}
                        initialSearchParams={{ kind: 3 }}
                        searchParams={(text) => ({ name: text, kind: 3 })}
                        required
                    />

                    <SelectField
                        name="paymentMethod"
                        label="Hình thức thanh toán"
                        allowClear={false}
                        options={paymentSelect}
                        required
                    />
                    <Form.Item>
                        <Checkbox defaultChecked disabled>
                            Cash on Delivery
                        </Checkbox>
                        <Typography.Paragraph type="secondary">More method coming soom</Typography.Paragraph>
                    </Form.Item>
                    <Button type="primary" htmlType="submit" loading={loadingOrderForGuest}>
                        Xác nhận đơn hàng
                    </Button>
                </Form>
            </Drawer>
        </div>
    );
};

export default AppCart;
