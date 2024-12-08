import { ReactComponent as Notification } from '@assets/icons/notification.svg';

import { ReactComponent as Dotblue } from '@assets/icons/dotBlue.svg';
import { ReactComponent as Empty } from '@assets/icons/nodata.svg';
import Typo from '@components/common/elements/Typo';
import { AppConstants, notificationKind, storageKeys } from '@constants';
import apiConfig from '@constants/apiConfig';
import { commonMessage } from '@constants/intl';
import useAuth from '@hooks/useAuth';
import useFetch from '@hooks/useFetch';
import useTranslate from '@hooks/useTranslate';
import { IconAlignBoxBottomCenter, IconCircleCheck, IconCircleX, IconTrash } from '@tabler/icons-react';
import { formatTimeDifference, price, titleNotification } from '@utils';
import React, { useEffect, useState } from 'react';
import { defineMessages } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import styles from './ProfileDropDown.module.scss';
import { Avatar, Menu, Space } from 'antd';
import { DownOutlined, LoginOutlined, UserOutlined } from '@ant-design/icons';
import avatar from '@assets/images/avatar_profile.png';
import { removeCacheToken } from '@services/userService';
import { useDispatch } from 'react-redux';
import { accountActions } from '@store/actions';
const message = defineMessages({
    All: 'Tất cả',
    Unread: 'Chưa đọc',
    readAll: 'Đọc tất cả',
    delete: 'Xoá tất cả',
    loadMore: 'Xem thêm',
});

const ProfileDropDown = ({ data, executeGetData, executeUpdateState, loading, unReadTotal, pageTotal, ...props }) => {
    const [ activeIcon, setActiveIcon ] = useState(false);
    const translate = useTranslate();
    const { profile } = useAuth();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const onLogout = () => {
        removeCacheToken();
        dispatch(accountActions.logout());
    };

    return (
        <div
            onMouseEnter={() => setActiveIcon(true)} // Giữ trạng thái khi di chuột vào vùng này
            onMouseLeave={() => setActiveIcon(false)} // Tắt dropdown khi rời chuột khỏi toàn bộ vùng
            style={{ position: 'relative' }}
        >
            <div style={{ color: 'var(--primary-color)' }}>
                <Space style={{ width: 'max-content' }}>
                    <Avatar
                        icon={<UserOutlined />}
                        //src={`${AppConstants.avatarRootUrl}${profile.logoPath || profile?.avatar || profile?.accountDto.avatar}`}
                        src={
                            profile?.account?.avatar?.includes('https') || profile?.account?.avatar == undefined
                                ? avatar
                                : AppConstants.contentRootUrl + profile?.account?.avatar
                        }
                    />
                    <span>{profile?.account?.fullName}</span>

                    <DownOutlined />
                </Space>
            </div>
            {activeIcon && (
                // Đặt ref cho toàn bộ khung dropdown
                <div className={styles.notiBox}>
                    {/* <span size={'var(--h3-font-size)'}>
                        {translate.formatMessage(commonMessage.notification)}
                    </span> */}
                    <Menu
                        // mode="inline"
                        className={styles.rightMenu}
                        selectedKeys={[]}
                        items={[
                            {
                                key: 'menu',
                                label: (
                                    <div style={{ display: 'flex', gap: '5px', alignItems: 'center', paddingLeft: 4 }}>
                                        <UserOutlined />
                                        Hồ sơ
                                    </div>
                                ),
                                onClick: () => navigate('/profile-user'),
                            },
                            {
                                key: 'history-order',
                                label: (
                                    <div style={{ display: 'flex', gap: '5px', alignItems: 'center', paddingLeft: 4 }}>
                                        <IconAlignBoxBottomCenter size={16} />
                                        Lịch sử đơn hàng
                                    </div>
                                ),
                                onClick: () => navigate('/history-order'),
                            },
                            {
                                key: 'logout',
                                label: (
                                    <div style={{ display: 'flex', gap: '5px', alignItems: 'center', paddingLeft: 4 }}>
                                        <LoginOutlined />
                                        Đăng xuất
                                    </div>
                                ),
                                onClick: onLogout,
                            },
                        ]}
                    />
                </div>
            )}
        </div>
    );
};

export default ProfileDropDown;
