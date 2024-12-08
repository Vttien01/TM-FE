import { EditOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import BaseTable from '@components/common/table/BaseTable';
import { accountStatusOptions, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import useAuth from '@hooks/useAuth';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import routes from '@routes';
import { IconEdit, IconStar } from '@tabler/icons-react';
import { Avatar, Button, Card, Divider, Flex, Form, Space, Tag, Tooltip, Typography } from 'antd';
import React, { useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './PersonInfo.module.scss';
import Container from '@components/common/elements/Container';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import useDisclosure from '@hooks/useDisclosure';
import AddressModal from './AddressModal';
import ProfileModal from './ProfileModal';

const message = defineMessages({
    objectName: 'Địa chỉ người dùng',
    titlePage: 'Trang cá nhân',
});

const PersonInfo = () => {
    const navigate = useNavigate();
    const { profile } = useAuth();
    const translate = useTranslate();
    const [ openAddressModal, handleAddressModal ] = useDisclosure(false);
    const [ openProfileModal, handleProfileModal ] = useDisclosure(false);
    const [ address, setAddress ] = useState(null);
    const { pathname: pagePath } = useLocation();
    const [ form ] = Form.useForm();

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

    return (
        <Container className={styles.container}>
            {/* <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: 20 }}> */}
            <PageWrapper routes={breadRoutes}>
                <div style={{ display: 'flex', justifyContent: 'center', margin: '30px 0px' }}>
                    <Space className={styles.roundedSquareLeft} direction="vertical">
                        <Avatar size={200} icon={<UserOutlined />} />
                        <Typography.Title style={{ fontSize: 35 }}>Người dùng</Typography.Title>
                        <Typography.Title level={3}>{profile?.account?.username}</Typography.Title>
                        <Space>
                            <Tooltip placement="bottom" title="Sửa thông tin cá nhân">
                                <IconEdit
                                    size={40}
                                    color="#282a36"
                                    onClick={() => handleProfileModal.open()}
                                    style={{ fontSize: 40, color: '#282a36', cursor: 'pointer' }}
                                />
                            </Tooltip>
                            <Tooltip placement="bottom" title="Đánh giá sản phẩm">
                                <IconStar
                                    size={40}
                                    color="#282a36"
                                    onClick={handleReview}
                                    style={{ marginLeft: 20, fontSize: 40, color: '#282a36', cursor: 'pointer' }}
                                />
                            </Tooltip>
                        </Space>
                    </Space>
                    <Space className={styles.roundedSquareRight} direction="vertical">
                        <div className={styles.boxWithBorder}>
                            <Divider orientation="left" style={{ fontSize: 25 }}>
                                Thông tin cá nhân
                            </Divider>
                        </div>
                        <Space direction="horizontal">
                            <DashboardCard title={'Họ và tên'} value={profile?.account?.fullName} />
                            <DashboardCard title={'Email'} value={profile?.account?.email} />
                        </Space>
                        <Space direction="horizontal">
                            <DashboardCard title={'Số điện thoại'} value={profile?.account?.phone} />
                            <DashboardCardStatus title={'Trạng thái hoạt động'} value={profile?.account?.status} />
                        </Space>
                        <Divider orientation="left" style={{ fontSize: 25 }}>
                            Thông tin địa chỉ
                        </Divider>
                        <ListPage
                            actionBar={
                                <Flex justify="end">
                                    <Button type="primary" onClick={() => handleAddressModal.open()}>
                                        <PlusOutlined /> Thêm mới
                                    </Button>
                                </Flex>
                            }
                            style={{ backgroundColor: '#fcd8bc', borderRadius: '10px' }}
                            baseTable={
                                <BaseTable
                                    onChange={mixinFuncs.changePagination}
                                    columns={columns}
                                    dataSource={data}
                                    loading={loading}
                                    pagination={pagination}
                                    style={{ minWidth: 800 }}
                                />
                            }
                        />
                    </Space>
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
                        handleProfileModal.close();
                        form.resetFields();
                    }}
                    profile={profile}
                />
            </PageWrapper>
        </Container>
    );
};

function DashboardCard({ title, value, icon, icon1, number }) {
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

export default PersonInfo;
