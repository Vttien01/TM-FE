import { ArrowDownOutlined, StarFilled, UserOutlined } from '@ant-design/icons';
import AvatarField from '@components/common/form/AvatarField';
import { DEFAULT_FORMAT } from '@constants';
import useAuth from '@hooks/useAuth';
import useDisclosure from '@hooks/useDisclosure';
import useTranslate from '@hooks/useTranslate';
import { convertUtcToLocalTime, getImageUrl } from '@utils/index';
import { Button, Col, Modal, Progress, Rate, Row, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { defineMessages } from 'react-intl';
import styles from './ReviewListForm.module.scss';
import ReviewModal from '../Review/ReviewModal';
import useFetch from '@hooks/useFetch';
import apiConfig from '@constants/apiConfig';
const messages = defineMessages({
    objectName: 'Đánh giá',
    update: 'Cập nhật',
    updateSuccess: 'Cập nhật {objectName} thành công',
});
const ReviewListModal = ({ loading, starReviewData, open, onCancel, orderDetail, dataListReview, ...props }) => {
    const translate = useTranslate();
    const { profile } = useAuth();
    const [ averageRating, setAverageRating ] = useState(0);
    const [ ratingPercentages, setRatingPercentages ] = useState([ 0, 0, 0, 0, 0 ]);

    const [ openCreateModal, handlersCreateModal ] = useDisclosure(false);
    const handleReviewModal = () => {
        onCancel;
        handlersCreateModal.open();
    };

    useEffect(() => {
        if (starReviewData) {
            const ratingCount = Array(5).fill(0);
            let totalStars = 0;
            let totalRatings = 0;
            starReviewData?.forEach((item) => {
                totalStars += item.star * item.amount;
                totalRatings += item.amount;

                if (item.star >= 1 && item.star <= 5) {
                    ratingCount[item.star - 1] += item.amount;
                }
            });
            const value = totalRatings > 0 ? (totalStars / totalRatings).toFixed(1) : 0;
            setAverageRating(totalRatings > 0 ? (totalStars / totalRatings).toFixed(1) : 0);
            const ratingPercentages = ratingCount.map((count) =>
                totalRatings > 0 ? Math.floor((count / totalRatings) * 100) : 0,
            );
            setRatingPercentages(ratingPercentages);
        }
    }, [ starReviewData ]);

    const [ visibleItems, setVisibleItems ] = useState(10);
    const [ isLoadingMore, setIsLoadingMore ] = useState(false);
    const dataToShow = dataListReview?.length > 0 ? dataListReview.slice(0, visibleItems) : dataListReview;

    const handleShowMore = () => {
        setIsLoadingMore(true);
        setTimeout(() => {
            setVisibleItems(visibleItems + 10);
            setIsLoadingMore(false);
        }, 150);
    };
    useEffect(() => {
        if (!open) {
            setVisibleItems(10);
        }
    }, [ open ]);
    return (
        // <Modal
        //     title={translate.formatMessage(messages.objectName)}
        //     {...props}
        //     centered
        //     open={open}
        //     maskClosable={false}
        //     onCancel={onCancel}
        //     footer={null}
        // >
        <Spin spinning={loading || isLoadingMore}>
            <div className={styles.modalReview}>
                <div style={{ marginBottom: '10px', borderBottom: '1px solid #ddd', paddingBottom: '20px' }}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Row>
                                <Col span={24} align="center">
                                    <h3 style={{ marginBottom: '10px', fontSize: '30px', color: '#1890FF' }}>
                                        {averageRating}
                                    </h3>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24} align="center">
                                    <Rate disabled allowHalf value={averageRating} />
                                </Col>
                            </Row>
                        </Col>
                        <Col span={12}>
                            <>
                                <Row>
                                    <Col span={24} style={{ display: 'flex', alignItems: 'center' }}>
                                        <span style={{ marginRight: '8px' }}>5</span>
                                        <StarFilled style={{ color: '#FFD700', marginRight: '8px' }} />
                                        <Progress
                                            strokeColor={'#FFD700'}
                                            percent={ratingPercentages[4]}
                                            style={{ flex: 1 }}
                                        />
                                    </Col>
                                    <Col span={24} style={{ display: 'flex', alignItems: 'center' }}>
                                        <span style={{ marginRight: '8px' }}>4</span>
                                        <StarFilled style={{ color: '#FFD700', marginRight: '8px' }} />
                                        <Progress
                                            strokeColor={'#FFD700'}
                                            percent={ratingPercentages[3]}
                                            style={{ flex: 1 }}
                                        />
                                    </Col>
                                    <Col span={24} style={{ display: 'flex', alignItems: 'center' }}>
                                        <span style={{ marginRight: '8px' }}>3</span>
                                        <StarFilled style={{ color: '#FFD700', marginRight: '8px' }} />
                                        <Progress
                                            strokeColor={'#FFD700'}
                                            percent={ratingPercentages[2]}
                                            style={{ flex: 1 }}
                                        />
                                    </Col>
                                    <Col span={24} style={{ display: 'flex', alignItems: 'center' }}>
                                        <span style={{ marginRight: '8px' }}>2</span>
                                        <StarFilled style={{ color: '#FFD700', marginRight: '8px' }} />
                                        <Progress
                                            strokeColor={'#FFD700'}
                                            percent={ratingPercentages[1]}
                                            style={{ flex: 1 }}
                                        />
                                    </Col>
                                    <Col span={24} style={{ display: 'flex', alignItems: 'center' }}>
                                        <span style={{ marginRight: '8px' }}>1</span>
                                        <StarFilled style={{ color: '#FFD700', marginRight: '8px' }} />
                                        <Progress
                                            strokeColor={'#FFD700'}
                                            percent={ratingPercentages[0]}
                                            style={{ flex: 1 }}
                                        />
                                    </Col>
                                </Row>
                            </>
                        </Col>
                    </Row>
                    {profile && profile?.account?.kind === 3 && (
                        <Row style={{ marginTop: '20px' }}>
                            <Col span={12} align="center">
                                <Button onClick={handleReviewModal} type="primary">
                                    Viết đánh giá
                                </Button>
                            </Col>
                        </Row>
                    )}
                </div>
                <>
                    <Row>
                        <span style={{ color: '#1890FF', fontSize: '16px', marginLeft: '8px', marginBottom: '10px' }}>
                            Danh sách đánh giá ({dataListReview?.length || 0} Review)
                        </span>
                    </Row>
                    <div>
                        {dataToShow?.length > 0
                            ? dataToShow?.map((item, index) => (
                                <Row
                                    gutter={16}
                                    key={index}
                                    style={{
                                        border: '1px solid #ddd',
                                        borderRadius: '6px',
                                        padding: '6px',
                                        margin: '0px 8px 14px 8px',
                                    }}
                                >
                                    <Col span={2} align="center" justify="center">
                                        <AvatarField
                                            size="large"
                                            icon={<UserOutlined />}
                                            src={getImageUrl(item?.userDto?.accountAutoCompleteDto?.avatarPath)}
                                        />
                                    </Col>
                                    <Col span={17}>
                                        <div style={{ fontWeight: '500', fontSize: '16px' }}>
                                            {item?.userDto?.accountAutoCompleteDto?.fullName}
                                        </div>
                                        <Row>
                                            <span>{item.message}</span>
                                        </Row>
                                        <Row>
                                            <span>{item.createdDate}</span>
                                        </Row>
                                    </Col>
                                    <Col span={5} style={{ textAlign: 'right' }}>
                                        <Rate disabled defaultValue={item?.star} style={{ fontSize: '14px' }} />
                                    </Col>
                                </Row>
                            ))
                            : ''}
                        {visibleItems < dataListReview?.length && (
                            <Col align="center">
                                <Button className={styles.btnAdd} type="text" onClick={handleShowMore}>
                                    <ArrowDownOutlined />
                                    Xem thêm
                                </Button>
                            </Col>
                        )}
                    </div>
                </>

                <ReviewModal
                    open={openCreateModal}
                    onCancel={() => handlersCreateModal.close()}
                    orderDetailId={orderDetail?.id}
                    profile={profile}
                    width={800}
                />
            </div>
        </Spin>
        // </Modal>
    );
};

export default ReviewListModal;
