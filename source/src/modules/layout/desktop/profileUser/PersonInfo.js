import { EditOutlined, LogoutOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import BaseTable from '@components/common/table/BaseTable';
import { accountStatusOptions, AppConstants, DEFAULT_FORMAT, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import useAuth from '@hooks/useAuth';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import routes from '@routes';
import { IconEdit, IconHome, IconStar } from '@tabler/icons-react';
import { Avatar, Button, Card, Col, Divider, Flex, Form, List, Rate, Row, Space, Tag, Tooltip, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './PersonInfo.module.scss';
import Container from '@components/common/elements/Container';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import useDisclosure from '@hooks/useDisclosure';
import AddressModal from './AddressModal';
import ProfileModal from './ProfileModal';
import useQueryParams from '@hooks/useQueryParams';
import useFetch from '@hooks/useFetch';
import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import { convertUtcToLocalTime } from '@utils';
import useFetchAction from '@hooks/useFetchAction';
import { accountActions } from '@store/actions';
import { use } from 'react';
import configPages from '@constants/menuConfig';
import TextField from '@components/common/form/TextField';
import { showErrorMessage, showSucsessMessage } from '@services/notifyService';
import { removeCacheToken } from '@services/userService';
import { useDispatch } from 'react-redux';

const message = defineMessages({
    objectName: 'Địa chỉ người dùng',
    titlePage: 'Trang cá nhân',
    updateSuccess: 'Cập nhật mật khẩu thành công',
    updateFail: 'Cập nhật mật khẩu thất bại',
});

const PersonInfo = () => {
    const navigate = useNavigate();
    const { profile } = useAuth();
    const translate = useTranslate();
    const [ openAddressModal, handleAddressModal ] = useDisclosure(false);
    const [ openProfileModal, handleProfileModal ] = useDisclosure(false);
    const [ address, setAddress ] = useState(null);
    const [ active, setActive ] = useState('info');
    const { pathname: pagePath } = useLocation();
    const [ form ] = Form.useForm();
    const queryParameters = new URLSearchParams(window.location.search);
    const content = queryParameters.get('content');
    const { deserializeParams, setQueryParams, params } = useQueryParams();
    const dispatch = useDispatch();
    const { execute: executeGetProfile } = useFetchAction(accountActions.getProfile, {
        loading: useFetchAction.LOADING_TYPE.APP,
    });
    const {
        data: dataMyReview,
        loading: loadingMyReview,
        execute: executeMyReview,
    } = useFetch(apiConfig.review.getMyReview, {
        immediate: false,
        mappingData: (res) => res.data,
    });
    const {
        data: dataMyVoucher,
        loading: loadingMyVoucher,
        execute: executeMyVoucher,
    } = useFetch(apiConfig.voucher.getMyVoucher, {
        immediate: false,
        mappingData: (res) => res.data,
    });
    useEffect(() => {
        if (content === 'my-review') {
            executeMyReview();
        } else if (content === 'my-voucher') {
            executeMyVoucher();
        }
    }, [ content ]);

    const { data, mixinFuncs, queryFilter, loading, pagination } = useListBase({
        // apiConfig: apiConfig.address,
        apiConfig: {
            ...apiConfig.address,
            getList: apiConfig.address.getMyAddress,
        },
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },
        params: {
            userId: profile.id,
        },
        override: (funcs) => {
            funcs.mappingData = (response) => {
                if (response.result === true) {
                    return {
                        data: response.data.content,
                        total: response.data.totalElements,
                    };
                }
            };

            funcs.getCreateLink = () => {
                return `${pagePath}/address/create?userId=${profile.id}`;
            };
            // funcs.getItemDetailLink = (dataRow) => {
            //     return `${pagePath}/address/${dataRow.id}?userId=${profile.id}`;
            //     // params:{},
            // };
            funcs.additionalActionColumnButtons = () => ({
                edit: (dataRow) => {
                    return (
                        <BaseTooltip type="edit" objectName={translate.formatMessage(message.objectName)}>
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setAddress(dataRow);
                                    handleAddressModal.open();
                                }}
                                type="link"
                                style={{ padding: 0 }}
                            >
                                <EditOutlined />
                            </Button>
                        </BaseTooltip>
                    );
                },
            });
        },
    });

    const columns = [
        {
            title: translate.formatMessage(commonMessage.Name),
            dataIndex: 'name',
            width: '150',
            align: 'center',
        },
        {
            title: translate.formatMessage(commonMessage.phone),
            dataIndex: 'phone',
            width: '30',
            align: 'center',
        },
        {
            title: translate.formatMessage(commonMessage.address),
            dataIndex: 'address',
            align: 'center',
            // align: 'center',
            render: (address, dataRow) => {
                return (
                    <div>
                        {address}, {dataRow?.wardInfo.name}, {dataRow?.districtInfo.name}, {dataRow?.provinceInfo.name}
                    </div>
                );
            },
        },

        // mixinFuncs.renderStatusColumn({ width: '150px' }),
        mixinFuncs.renderActionColumn({ edit: true, delete: true }, { width: '130px' }),
    ];

    const handleReview = () => {
        navigate(routes.ReviewPage.path + `?userId=${profile.id}`);
    };

    const breadRoutes = [ { breadcrumbName: translate.formatMessage(message.titlePage) } ];
    const onLogout = () => {
        removeCacheToken();
        dispatch(accountActions.logout());
        navigate('/');
    };

    return (
        <Container className={styles.container}>
            {/* <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: 20 }}> */}
            <PageWrapper routes={breadRoutes}>
                <div style={{ display: 'flex', justifyContent: 'center', margin: '30px 0px' }}>
                    <Space className={styles.roundedSquareLeft} direction="vertical">
                        <Flex align="center" justify="center" style={{ margin: '20px 0 10px' }} vertical>
                            <Avatar
                                size={200}
                                src={
                                    profile?.account?.avatar ? (
                                        `${AppConstants.contentRootUrl}${profile?.account?.avatar}`
                                    ) : (
                                        <UserOutlined />
                                    )
                                }
                            />
                            <Typography.Title style={{ fontSize: 35 }}>Người dùng</Typography.Title>
                            <Typography.Title level={3} style={{ margin: 0 }}>
                                {profile?.account?.username}
                            </Typography.Title>
                        </Flex>
                        <div className={styles.navbarMain}>
                            {configPages.map((item, index) => {
                                return (
                                    <Flex
                                        align="center"
                                        justify="center"
                                        className={`${styles.navbarItem} ${active === item.key ? styles.active : ''}`}
                                        key={item.key}
                                        gap={10}
                                        onClick={() => {
                                            setActive(item.key);
                                            setQueryParams({ content: item.key });
                                        }}
                                    >
                                        {React.cloneElement(item.icon, {
                                            style: {
                                                fontSize: 30,
                                                color: '#282a36',
                                            },
                                        })}

                                        <Typography.Title level={3} style={{ marginBottom: 0 }}>
                                            {item.title}
                                        </Typography.Title>
                                    </Flex>
                                );
                            })}
                            <Flex
                                align="center"
                                justify="center"
                                className={styles.navbarItem}
                                key={'logout'}
                                gap={10}
                                onClick={() => onLogout()}
                                // className={`${styles.item} ${active === 'logout' ? styles.activeItem : ''}`}
                            >
                                <LogoutOutlined style={{ fontSize: 30 }} color="#282a36" />

                                <Typography.Title level={3} style={{ marginBottom: 0 }}>
                                    <FormattedMessage defaultMessage="Đăng xuất" />
                                </Typography.Title>
                            </Flex>
                        </div>
                    </Space>
                    {content == 'my-address' ? (
                        <Space className={styles.roundedSquareRight} direction="vertical">
                            <div className={styles.boxWithBorder}>
                                <Divider orientation="left" style={{ fontSize: 25, marginBottom: '20px' }}>
                                    Thông tin địa chỉ
                                </Divider>
                            </div>
                            <Flex justify="end" style={{ width: '800px', position: 'absolute', top: 160, right: 160 }}>
                                <Button type="primary" onClick={() => handleAddressModal.open()}>
                                    <PlusOutlined /> Thêm mới
                                </Button>
                            </Flex>
                            <BaseTable
                                onChange={mixinFuncs.changePagination}
                                columns={columns}
                                dataSource={data}
                                loading={loading}
                                pagination={pagination}
                                style={{ minWidth: 800 }}
                            />
                        </Space>
                    ) : content == 'my-review' ? (
                        <MyReview loadingMyReview={loadingMyReview} dataMyReview={dataMyReview} />
                    ) : content == 'my-voucher' ? (
                        <MyVoucher loadingMyVoucher={loadingMyVoucher} dataMyVoucher={dataMyVoucher} />
                    ) : content == 'change-password' ? (
                        <ChangePassword />
                    ) : (
                        <Space className={styles.roundedSquareRight} direction="vertical">
                            <div className={styles.boxWithBorder}>
                                <Divider orientation="left" style={{ fontSize: 25, marginBottom: '20px' }}>
                                    Thông tin cá nhân
                                </Divider>
                            </div>
                            <Space direction="horizontal">
                                <DashboardCard title={'Họ và tên'} value={profile?.account?.fullName} />
                                <DashboardCard title={'Username'} value={profile?.account?.username} />
                            </Space>
                            <Space direction="horizontal">
                                <DashboardCard title={'Số điện thoại'} value={profile?.account?.phone} />
                                <DashboardCard title={'Email'} value={`${profile?.account?.email}`} />
                            </Space>
                            <Space direction="horizontal">
                                <DashboardCardStatus title={'Trạng thái hoạt động'} value={profile?.account?.status} />
                                <DashboardCard
                                    title={'Điểm cá nhân'}
                                    value={
                                        <div
                                            style={{ color: 'green', fontSize: 20, fontWeight: 600 }}
                                        >{`${profile?.point}đ`}</div>
                                    }
                                />
                            </Space>
                            <Space direction="horizontal">
                                <Button
                                    size="large"
                                    type="primary"
                                    style={{ marginTop: 20 }}
                                    onClick={() => handleProfileModal.open()}
                                >
                                    Cập nhật thông tin cá nhân
                                </Button>
                            </Space>
                        </Space>
                    )}
                </div>
                <AddressModal
                    open={openAddressModal}
                    onCancel={(e) => {
                        handleAddressModal.close();
                        setAddress(null);
                        form.resetFields();
                    }}
                    address={address}
                    form={form}
                    getList={() => mixinFuncs.getList()}
                />
                <ProfileModal
                    open={openProfileModal}
                    onCancel={(e) => {
                        executeGetProfile();
                        handleProfileModal.close();
                        form.resetFields();
                    }}
                    profile={profile}
                />
            </PageWrapper>
        </Container>
    );
};

function DashboardCard({ title, value, icon, icon1, number, children }) {
    return (
        <Card style={{ minWidth: 400, backgroundColor: '#e7e7e7' }}>
            <Space direction="vertical">
                <Typography.Title style={{ fontSize: 16 }}>{title}</Typography.Title>
                <Typography.Text>{value}</Typography.Text>
            </Space>
        </Card>
    );
}

function DashboardCardStatus({ title, value, icon, icon1, number }) {
    const translate = useTranslate();
    const stateValues = translate.formatKeys(accountStatusOptions, [ 'label' ]);
    const state = stateValues.find((item) => item.value == value);
    return (
        <Card style={{ minWidth: 400, backgroundColor: '#e7e7e7' }}>
            <Space direction="vertical">
                <Typography.Title level={5}>{title}</Typography.Title>
                <Tag
                    color={state.color}
                    style={{ width: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <div style={{ padding: '0 0px', fontSize: 14 }}>{state.label}</div>
                </Tag>
            </Space>
        </Card>
    );
}

function MyVoucher({ loadingMyVoucher, dataMyVoucher }) {
    const translate = useTranslate();
    const IconText = ({ icon, text }) => (
        <Space>
            {React.createElement(icon)}
            {text}
        </Space>
    );
    return (
        <Space className={styles.roundedSquareRight} direction="vertical">
            <div className={styles.boxWithBorder}>
                <Divider orientation="left" style={{ fontSize: 25, marginBottom: '20px' }}>
                    Danh sách các voucher của người dùng
                </Divider>
            </div>
            <List
                loading={loadingMyVoucher}
                pagination={dataMyVoucher?.length > 0 && true}
                // className="demo-loadmore-list"
                itemLayout="horizontal"
                dataSource={dataMyVoucher || []}
                style={{ marginBottom: 10, border: '1px solide white', minWidth: 800 }}
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
                                    <a href={`/detail/${item.productId}`} style={{ fontSize: 25 }}>
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
                                        <div style={{ flex: '1', justifyContent: 'center' }}>Màu: {item.color}</div>
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
        </Space>
    );
}

function MyReview({ loadingMyReview, dataMyReview }) {
    const translate = useTranslate();
    const IconText = ({ icon, text }) => (
        <Space>
            {React.createElement(icon)}
            {text}
        </Space>
    );
    return (
        <Space className={styles.roundedSquareRight} direction="vertical">
            <div className={styles.boxWithBorder}>
                <Divider orientation="left" style={{ fontSize: 25, marginBottom: '20px' }}>
                    Danh sách các đánh giá của người dùng
                </Divider>
            </div>
            <List
                loading={loadingMyReview}
                pagination={dataMyReview?.length > 0 && true}
                // className="demo-loadmore-list"
                itemLayout="horizontal"
                dataSource={dataMyReview || []}
                style={{ marginBottom: 10, border: '1px solide white', minWidth: 800 }}
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
                                    <a href={`/detail/${item.productId}`} style={{ fontSize: 25 }}>
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
                                        <div style={{ flex: '1', justifyContent: 'center' }}>Màu: {item.color}</div>
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
        </Space>
    );
}

function ChangePassword() {
    const translate = useTranslate();
    const [ form ] = Form.useForm();
    const { execute, loading } = useFetch(apiConfig.user.changePassword, {
        immediate: false,
    });
    const handleChangePassword = () => {
        const data = form.getFieldsValue();
        execute({
            data: { ...data },
            onCompleted: (res) => {
                showSucsessMessage(translate.formatMessage(message.updateSuccess));
                form.resetFields();
            },
            onError: ({ response }) => {
                if (response?.data?.message) showErrorMessage(response?.data?.message);
                else showErrorMessage(translate.formatMessage(message.updateFail));
            },
        });
    };
    return (
        <Space className={styles.roundedSquareRight} direction="vertical">
            <div className={styles.boxWithBorder}>
                <Divider orientation="left" style={{ fontSize: 25, marginBottom: '20px' }}>
                    Đổi mật khẩu
                </Divider>
            </div>
            <Form form={form} layout="horizontal" style={{ margin: '10px 20px' }}>
                <Row gutter={16} style={{ padding: '0 80px' }}>
                    <Col span={24}>
                        <TextField
                            type="password"
                            label={<FormattedMessage defaultMessage="Mật khẩu cũ" />}
                            required
                            name="oldPassword"
                        />
                    </Col>
                    <Col span={24}>
                        <TextField
                            required
                            type="password"
                            label={<FormattedMessage defaultMessage="Mật khẩu mới" />}
                            name="newPassword"
                            rules={[
                                {
                                    validator: async () => {
                                        const isTouched = form.isFieldTouched('newPassword');
                                        if (isTouched) {
                                            const value = form.getFieldValue('newPassword');
                                            if (value.length < 6) {
                                                throw new Error(
                                                    translate.formatMessage(commonMessage.validatePassword),
                                                );
                                            }
                                        }
                                    },
                                },
                            ]}
                        />
                    </Col>
                    <Col span={24}>
                        <TextField
                            type="password"
                            label={translate.formatMessage(commonMessage.confirmPassword)}
                            rules={[
                                {
                                    validator: async () => {
                                        const password = form.getFieldValue('newPassword');
                                        const confirmPassword = form.getFieldValue('confirmPassword');
                                        if (password !== confirmPassword) {
                                            throw new Error(translate.formatMessage(commonMessage.passwordNotMatch));
                                        }
                                    },
                                },
                            ]}
                        />
                    </Col>
                    <Col span={24}>
                        <Flex justify="flex-end">
                            <Button
                                size="large"
                                key="ok"
                                type="primary"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleChangePassword();
                                }}
                                loading={loading}
                            >
                                Đổi mật khẩu
                            </Button>
                        </Flex>
                    </Col>
                </Row>
            </Form>
        </Space>
    );
}

export default PersonInfo;
