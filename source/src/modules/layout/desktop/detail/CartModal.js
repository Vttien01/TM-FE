import apiConfig from '@constants/apiConfig';
import useAuth from '@hooks/useAuth';
import useFetch from '@hooks/useFetch';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import { showErrorMessage, showSucsessMessage, showWarningMessage } from '@services/notifyService';
import { getCartItemList } from '@store/actions/cart';
import { IconMinus, IconPlus } from '@tabler/icons-react';
import { formatMoney } from '@utils';
import { getData } from '@utils/localStorage';
import { Button, Flex, Form, InputNumber, Modal, Table } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { FormattedMessage, defineMessage } from 'react-intl';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const message = defineMessage({
    copyRight: '{brandName} - © Copyright {year}. All Rights Reserved',
    loginFail: 'Chưa điền đủ các trường thông tin!!!',
    login: 'Đăng nhập',
});

const CartModal = ({ open, onCancel, check, product }) => {
    const { profile } = useAuth();
    const [ checkList, setCheckList ] = useState(false);
    const [ form ] = Form.useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const nameProduct = product?.name || '';

    const [ cart, setCart ] = useState([]);
    const { execute: executeAddCart, loading } = useFetch(apiConfig.cart.create, {
        immediate: false,
    });
    const listProductVariant = useMemo(() => {
        if (product?.listProductVariant?.length > 0) {
            return product?.listProductVariant?.map((item) => ({
                ...item,
                quantity: 0,
                variantId: item?.id,
                productName: nameProduct,
            }));
        }
        return [];
    }, [ product ]);
    const [ newArray, setnewArray ] = useState([]);

    const handleQuantityChange = (value, record) => {
        const updatedList = listProductVariant.map((item) =>
            item.variantId === record.variantId ? { ...item, quantity: value } : item,
        );
    };
    const storedCart = useMemo(() => {
        if (localStorage.getItem('cart')) {
            return JSON.parse(localStorage.getItem('cart'));
        }
    }, [ product ]);
    const { execute: executeGetListCart } = useFetch(apiConfig.cart.getList, {
        immediate: false,
    });

    useEffect(() => {
        if (listProductVariant?.length > 0) {
            setnewArray(listProductVariant);
        }
        if (!profile) {
            setCart(storedCart?.length > 0 ? storedCart : []);
        }
    }, [ product ]);
    useEffect(() => {
        setnewArray((prevArray) => prevArray.filter((item) => item.quantity !== 0));
        setCheckList(false);
    }, [ checkList ]);

    const handleFinish = async () => {
        let updatedCart = [];
        newArray.forEach((product) => {
            let existingItem = null;
            if (cart?.length > 0) {
                existingItem = cart.find((item) => item.id === product.id);
            }
            if (existingItem != null) {
                updatedCart = cart.map((item) =>
                    item.id === product.id
                        ? {
                            ...item,
                            quantity: item?.quantity + product.quantity,
                            totalPriceSell: item?.totalPriceSell + product.totalPriceSell,
                        }
                        : item,
                );
                setCart(updatedCart);
            } else {
                updatedCart = [ ...cart, { ...product } ];
                setCart([ ...cart, { ...product } ]);
            }
        });
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        dispatch(getCartItemList(updatedCart));
        let data;
        data = { variantId: newArray[0].id, quantity: newArray[0].quantity };
        if (profile) {
            executeAddCart({
                data: { ...data },
                onCompleted: (res) => {
                    showSucsessMessage('Thêm vào giỏ hàng thành công');
                    executeGetListCart({
                        onCompleted: (response) => {
                            if (response?.data?.cartDetailDtos?.length > 0) {
                                dispatch(getCartItemList(response?.data?.cartDetailDtos));
                            } else {
                                dispatch(getCartItemList([]));
                            }
                        },
                        onError: () => {},
                    });
                    onCancel();
                },
                onError: () => {
                    showErrorMessage('Thêm vào giỏ hàng thất bại');
                    form.resetFields();
                },
            });
        }
        onCancel();
    };

    const handleBuyNow = () => {
        if (newArray[0]?.quantity === 0) {
            showWarningMessage('Bạn phải chọn sản phẩm');
        } else {
            const data = newArray.map((item) => ({ ...item, productName: nameProduct }));
            navigate(routes.OderPage.path, {
                state: { data: { ...newArray[0] } },
            });
        }
    };
    const handleParser = (value) => {
        const parsedValue = value.toString().replace(/[^0-9]/g, ''); // Chỉ giữ lại số
        return parsedValue;
    };
    const QuantityComponent = ({ value, record }) => {
        return (
            <Flex align="center" gap={10}>
                <button type="button" className="qty-decrease flex align-center justify-center">
                    <i className="fas fa-minus"></i>
                    <IconMinus />
                </button>

                <div style={{ width: 'max-content', padding: '0 10px' }}>3</div>

                <button type="button" className="qty-increase flex align-center justify-center">
                    <i className="fas fa-plus"></i>
                    <IconPlus />
                </button>
            </Flex>
        );
    };
    return (
        <Modal
            title={<FormattedMessage defaultMessage="Vui lòng chọn sản phẩm" />}
            open={open}
            onCancel={onCancel}
            // onOk={() => form.submit()}
            width={800}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Đóng
                </Button>,
                check === 1 && (
                    <Button
                        key="ok"
                        type="primary"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleFinish();
                        }}
                    >
                        Thêm vào giỏ hàng
                    </Button>
                ),
                check === 2 && (
                    <Button
                        key="buyNow1"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleBuyNow();
                            // handlerDetailsModal.open();
                        }}
                    >
                        Thanh toán
                    </Button>
                ),
            ]}
        >
            <Form form={form}>
                <Table
                    pagination={false}
                    onChange={(extra) => {}}
                    columns={[
                        {
                            title: 'Tên sản phẩm',
                            dataIndex: 'productName',
                            align: 'center',
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
                            width: 'max-content',
                            render: (value) => {
                                return (
                                    <span>
                                        {formatMoney(value - (value * product?.saleOff ?? 0) / 100, {
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
                            title: 'Số lượng trong kho',
                            dataIndex: 'totalStock',
                            align: 'center',
                        },
                        {
                            title: 'Quantity',
                            dataIndex: 'quantity',
                            align: 'center',
                            render: (value, record) => {
                                return (
                                    // <QuantityComponent value={value} record={record} />
                                    <InputNumber
                                        min={0}
                                        max={record.totalStock}
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        // parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                        parser={handleParser}
                                        defaultValue={0}
                                        onChange={(value) => {
                                            if (value == 0) {
                                                const newArray = listProductVariant.map((item) => ({
                                                    ...item,
                                                    quantity: 0,
                                                    variantId: item?.id,
                                                    productName: nameProduct,
                                                }));
                                                setnewArray(newArray);
                                                setCheckList(false);
                                            } else {
                                                setnewArray((pre) =>
                                                    pre.map((cart) => {
                                                        if (record.id === cart.id) {
                                                            cart.totalPriceSell =
                                                                (cart.price -
                                                                    (cart.price * product?.saleOff ?? 0) / 100) *
                                                                value;
                                                            cart.quantity = value;
                                                        }
                                                        return cart;
                                                    }),
                                                );
                                                setCheckList(true);
                                            }
                                        }}
                                    />
                                );
                            },
                        },
                        {
                            title: 'Total',
                            dataIndex: 'totalPriceSell',
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
                    ]}
                    dataSource={newArray}
                    // summary={(data) => {
                    //     const total = data.reduce((pre, current) => {
                    //         return pre + current.totalPriceSell;
                    //     }, 0);
                    //     return (
                    //         <span>
                    //             Total:{' '}
                    //             {formatMoney(total, {
                    //                 groupSeparator: ',',
                    //                 decimalSeparator: '.',
                    //                 currentcy: 'đ',
                    //                 currentcyPosition: 'BACK',
                    //                 currentDecimal: '0',
                    //             })}
                    //         </span>
                    //     );
                    // }}
                ></Table>
            </Form>
        </Modal>
    );
};

export default CartModal;
