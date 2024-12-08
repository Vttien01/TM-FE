/* eslint-disable indent */
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import { paidValues } from '@constants/masterData';
import useAuth from '@hooks/useAuth';
import useDisclosure from '@hooks/useDisclosure';
import useFetch from '@hooks/useFetch';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import { Avatar, Card, Divider, Form, List, Rate, Space, Table, Typography, theme } from 'antd';
import { defineMessage } from 'react-intl';
import ListDetailsForm from './ListDetailsForm';
import { convertUtcToLocalTime } from '@utils';
import { DEFAULT_FORMAT } from '@constants';
import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import Container from '@components/common/elements/Container';
import styles from './index.module.scss';

const decription = defineMessage({
    first: 'Kiểm tra số lượng sản phẩm',
    second: 'Thanh toán đơn hàng',
    third: 'Hoàn thành các bước',
});

const ReviewPage = () => {
    const { profile } = useAuth();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const queryParameters = new URLSearchParams(window.location.search);
    const [ openedDetailsModal, handlerDetailsModal ] = useDisclosure(false);
    const [ form ] = Form.useForm();
    const translate = useTranslate();

    const { token } = theme.useToken();

    const {
        data: detail,
        loading: loadingMyReview,
        execute: executeMyReview,
    } = useFetch(apiConfig.review.myReview, {
        immediate: true,
    });

    const IconText = ({ icon, text }) => (
        <Space>
            {React.createElement(icon)}
            {text}
        </Space>
    );

    return (
        <Container className={styles.container}>
            <PageWrapper
                routes={[
                    { breadcrumbName: 'Trang cá nhân', path: routes.PersonInfo.path },
                    { breadcrumbName: 'Đánh giá sản phẩm' },
                ]}
                // title={title}
                style={{ backgroundColor: '#282a36' }}
            >
                <div style={{ flex: '1', justifyContent: 'center', margin: 20 }}>
                    <Card style={{ backgroundColor: '#d8dadd' }}>
                        <Divider orientation="left" style={{ fontSize: 25 }}>
                            Danh sách các đánh giá của người dùng
                        </Divider>
                        <List
                            pagination={detail?.data?.length > 0 && true}
                            className="demo-loadmore-list"
                            itemLayout="horizontal"
                            dataSource={detail?.data}
                            style={{ marginBottom: 10, height: '50vh' }}
                            renderItem={(item) => (
                                <Card style={{ backgroundColor: '#eff0f1', marginTop: 10 }}>
                                    <List.Item
                                        itemLayout="vertical"
                                        key={item?.id}
                                        actions={[
                                            <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
                                            <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
                                            <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
                                        ]}
                                    >
                                        <List.Item.Meta
                                            avatar={<Avatar src={item?.image} size={100} alt="" />}
                                            title={
                                                <a href="https://ant.design" style={{ fontSize: 25 }}>
                                                    {item?.productName}
                                                </a>
                                            }
                                            description={
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        flexDirection: 'column',
                                                    }}
                                                >
                                                    <div style={{ flex: '1', justifyContent: 'center' }}>
                                                        <Rate disabled allowHalf value={item?.star} />
                                                    </div>
                                                    <div style={{ flex: '1', justifyContent: 'center' }}>
                                                        Màu: {item.color}
                                                    </div>
                                                    <div style={{ flex: '1', justifyContent: 'center' }}>
                                                        Ngày tạo: {''}
                                                        <span>
                                                            {convertUtcToLocalTime(
                                                                item?.createdDate,
                                                                DEFAULT_FORMAT,
                                                                DEFAULT_FORMAT,
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div style={{ flex: '1', justifyContent: 'center' }}>
                                                        <Typography.Paragraph
                                                            ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}
                                                            style={{ fontSize: 18 }}
                                                        >
                                                            Nội dung: {item?.message}
                                                        </Typography.Paragraph>
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
            </PageWrapper>
        </Container>
    );
};

export default ReviewPage;
