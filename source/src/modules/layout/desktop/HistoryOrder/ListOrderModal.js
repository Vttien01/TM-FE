import { StarFilled } from '@ant-design/icons';
import apiConfig from '@constants/apiConfig';
import { statusOptions } from '@constants/masterData';
import useDisclosure from '@hooks/useDisclosure';
import useFetch from '@hooks/useFetch';
import useTranslate from '@hooks/useTranslate';
import { showErrorMessage, showSucsessMessage } from '@services/notifyService';
import { formatMoney, getImageUrl } from '@utils';
import { Avatar, Button, Card, Flex, List, Modal, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, defineMessage } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';
import { apiFrontend, AppConstants } from '@constants';
import ReviewListForm from './ReviewListForm';
import CreateReviewForm from './CreateReviewForm';
import { setData } from '@utils/localStorage';
import BuyAgainModal from './BuyAgainModal';
import product from '@assets/images/product.jpg';

const messages = defineMessage({
    copyRight: '{brandName} - © Copyright {year}. All Rights Reserved',
    loginFail: 'Chưa điền đủ các trường thông tin!!!',
    login: 'Đăng nhập',
});

const ListOrderModal = ({ open, detail, form, isEditing, orderId, state, orderDetailCommon, handlerDetailsModal }) => {
    const [ opeBuyAgainModal, handlersBuyAgainModal ] = useDisclosure(false);
    const { execute: createTransaction, loading: loadingCreateTransaction } = useFetch(apiConfig.transaction.create, {
        immediate: false,
    });
    const isPaid = orderDetailCommon?.isPaid;
    const paymentMethod = orderDetailCommon?.paymentMethod;
    const [ active, setActive ] = useState(1);
    const [ orderDetailProdcut, setOrderDetailProdcut ] = useState({});
    const [ checkReivew, setCheckReview ] = useState(true);

    const handleFinish = () => {
        createTransaction({
            data: {
                orderId: orderId,
                urlCancel: `${apiFrontend}my-order-fail`,
                urlSuccess: `${apiFrontend}my-order-success`,
            },
            onCompleted: (res) => {
                window.location.href = res.data;
                showSucsessMessage('Đơn hàng đang được xử lý!');
            },
            onError: () => {
                showErrorMessage('Thanh toán PAYPAL thất bại');
            },
        });
    };

    const { data: dataListReview, execute: executeListReview } = useFetch(apiConfig.review.getByProduct, {
        immediate: false,
        mappingData: ({ data }) => data.content,
    });

    const {
        data: starReviewData,
        loading: starDataLoading,
        execute: executeStarReviewData,
    } = useFetch(apiConfig.review.starCountForEach, { immediate: false, mappingData: ({ data }) => data.content });
    const getListReview = (id) => {
        executeListReview({
            params: {
                productId: id,
            },
        });
        executeStarReviewData({
            pathParams: {
                id,
            },
        });
    };

    const onCancel = () => {
        handlerDetailsModal.close();
        setActive(1);
    };

    return (
        <Modal
            title={
                active == 1
                    ? 'Chi tiết đơn hàng'
                    : active == 2
                        ? 'Đánh giá sản phẩm'
                        : active == 3
                            ? 'Viết đánh giá'
                            : 'Mua lại đơn hàng'
            }
            open={open}
            width={900}
            onCancel={onCancel}
            bodyStyle={{ height: 'max-content', maxHeight: '70vh', overflow: 'auto' }}
            footer={[
                state == 1 && (
                    <Button key="cancel" onClick={onCancel}>
                        Đóng
                    </Button>
                ),
                state == 1 && paymentMethod == 1 && !isPaid && (
                    <Button key="ok" type="primary" onClick={handleFinish} loading={loadingCreateTransaction}>
                        Tiến hành thanh toán
                    </Button>
                ),
                state == 3 && !opeBuyAgainModal && (
                    <Button
                        key="buyAgain"
                        onClick={() => {
                            handlersBuyAgainModal.open();
                            setActive(4);
                        }}
                    >
                        Mua lại
                    </Button>
                ),
            ]}
        >
            <Card>
                {active == 4 ? (
                    <BuyAgainModal
                        open={opeBuyAgainModal}
                        onCancel={onCancel}
                        detail={detail?.content}
                        orderDetailCommon={orderDetailCommon}
                        width={800}
                        setActive={setActive}
                    />
                ) : active == 3 ? (
                    <CreateReviewForm
                        setActive={setActive}
                        orderDetailId={orderDetailProdcut?.id}
                        onCancel={onCancel}
                    />
                ) : active == 2 ? (
                    <ReviewListForm
                        dataListReview={dataListReview || {}}
                        starReviewData={starReviewData}
                        width={800}
                        orderDetail={orderDetailProdcut}
                        checkReivew={checkReivew}
                    />
                ) : (
                    <List
                        className="demo-loadmore-list"
                        itemLayout="horizontal"
                        dataSource={detail.content}
                        style={{ marginBottom: 10 }}
                        renderItem={(item) => (
                            <Card style={{ backgroundColor: '#eff0f1', marginTop: 10 }}>
                                <List.Item key={item?.id}>
                                    <List.Item.Meta
                                        avatar={
                                            <Avatar
                                                src={item?.image ? getImageUrl(item?.image) : product}
                                                size={100}
                                                alt=""
                                            />
                                        }
                                        title={
                                            <Link to={`/detail/${item?.id}`} style={{ fontSize: 25 }}>
                                                {item?.name}
                                            </Link>
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
                                                    Số lượng: {item.amount}
                                                </div>
                                                <div style={{ flex: '1', justifyContent: 'center' }}>
                                                    Màu: {item.color}
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
                                    <div>
                                        {state == 4 && (
                                            <Flex justify="center" align="center">
                                                <StarFilled
                                                    style={{
                                                        fontSize: 28,
                                                        color: 'rgb(229, 241, 11)',
                                                        marginRight: 10,
                                                    }}
                                                />
                                                {item?.isReviewed == true ? (
                                                    <div
                                                        style={{
                                                            fontSize: 20,
                                                            fontWeight: 500,
                                                            color: 'rgb(229, 241, 11)',
                                                            cursor: 'pointer',
                                                        }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            getListReview(item?.productId);
                                                            setOrderDetailProdcut(item);
                                                            setActive(2);
                                                        }}
                                                    >
                                                        Xem đánh giá
                                                    </div>
                                                ) : (
                                                    <div
                                                        style={{
                                                            fontSize: 20,
                                                            fontWeight: 500,
                                                            color: 'rgb(229, 241, 11)',
                                                            cursor: 'pointer',
                                                        }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setOrderDetailProdcut(item);
                                                            setActive(3);
                                                        }}
                                                    >
                                                        Viết đánh giá
                                                    </div>
                                                )}
                                            </Flex>
                                        )}
                                    </div>
                                </List.Item>
                            </Card>
                        )}
                    />
                )}
                {active == 2 && (
                    <Flex justify="end">
                        <Button size="large" onClick={() => setActive(1)}>
                            Quay lại
                        </Button>
                    </Flex>
                )}
            </Card>
        </Modal>
    );
};

export default ListOrderModal;
