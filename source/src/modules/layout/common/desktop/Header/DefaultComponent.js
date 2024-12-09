import Container from '@components/common/elements/Container';
import React, { useEffect, useState } from 'react';
import logo from '@assets/images/logoTech.png';
import styles from './DefaultComponent.module.scss';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import search from '@assets/images/searching_icon.png';
import order from '@assets/images/order_icon.png';
import planet from '@assets/icons/planet.svg';
import { ReactComponent as Notification } from '@assets/icons/notification.svg';
import ProfileDropDown from '../ProfileDropDown';
import { FormattedMessage, defineMessages } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import useAuth from '@hooks/useAuth';
import { showErrorMessage, showSucsessMessage } from '@services/notifyService';
import { scrollToID } from '@utils';
import { IconBellFilled, IconSearch, IconTruckDelivery, IconUser } from '@tabler/icons-react';
import NotificationDropDown from '../NotificationDropDown';
import useFetch from '@hooks/useFetch';
import apiConfig from '@constants/apiConfig';
import { Link as LinkScroll } from 'react-scroll';

import { ReactComponent as Cart } from '@assets/icons/carIcon.svg';
import { useDispatch, useSelector } from 'react-redux';
import { selectedNotificationSelector } from '@selectors/app';
import classNames from 'classnames';
import routes from '@routes';
import { appActions } from '@store/actions';
import { showAppLoginModal } from '@store/actions/app';
import Typo from '@components/common/elements/Typo';
import { getCacheAccessToken } from '@services/userService';
import { Avatar, Flex, Form, Image, Input, Tooltip } from 'antd';
import useFocusWithin from '@hooks/useFocusWithin';
import AppCart from '../../AppCart/AppCart';
import SearchBox from '@components/common/elements/SearchBox/SearchBox';

const navs = [
    { title: 'Giới thiệu', to: '/introduction' },
    { title: 'Kinh nghiệm hay', to: '/experencies' },
    { title: 'Liên hệ', to: '/contact' },
];
const message = defineMessages({
    login: ' Đăng nhập',
    signup: 'Đăng ký',
    studentLogin: 'Student Login',
    inputSearch: 'Nhập tên khóa học',
});

const DefaultComponent = ({ openLogin, style, openProfile, openConfirm }) => {
    const params = useLocation();
    const dispatch = useDispatch();
    const { isAuthenticated } = useAuth();

    const queryParameters = new URLSearchParams(window.location.search);
    const query = queryParameters.get('query');
    const translate = useTranslate();
    const numberCart = useSelector((state) => state.cart.cart);
    const navigate = useNavigate();
    const appLogin = useSelector((state) => state.app.loginModal);
    // Notification
    const path = window.location.pathname;
    const notification = useSelector(selectedNotificationSelector);
    const accessToken = getCacheAccessToken();
    const {
        data: dataMyNotification,
        execute: executeGetDataMyNotification,
        loading: loadingDataMyNotification,
    } = useFetch(apiConfig.notification.myNotification, {
        immediate: false,
        mappingData: ({ data }) => {
            const pageTotal = data?.totalPages;
            const unReadTotal = data?.totalUnread;
            const listNotification = data?.content?.map((item) => {
                const msg = JSON.parse(item?.msg);
                return {
                    id: item?.id,
                    kind: item?.kind,
                    createdDate: item?.createdDate,
                    state: item?.state,
                    revenueMoney: msg?.revenueMoney,
                    courseName: msg?.courseName,
                    bookingCode: msg?.code,
                };
            });
            return {
                pageTotal,
                unReadTotal,
                listNotification,
            };
        },
    });
    // const accessToken = getCacheAccessToken();
    // useEffect(() => {
    //     accessToken && executeGetDataMyNotification();
    // }, []);
    const { execute: executeUpdateState } = useFetch(apiConfig.notification.changeState, {
        immediate: false,
    });
    const scrollToTop = () => {
        // Using window.scrollTo for smooth scrolling to the top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const openModalLogin = () => {
        dispatch(showAppLoginModal({}));
    };
    const isHomePage = path === '/';
    const handleSubmit = (values) => {
        try {
            navigate(`/search?query=${values?.searchValue}`);
            dispatch(appActions.setListSearch({}));
        } catch (error) {
            console.error('Search error:', error);
        }
    };
    return (
        <div className={classNames(styles.headerContainer, 'container-fluid')}>
            <div className={styles.navHeader}>
                <div className={styles.headerLogo} onClick={() => navigate('/')}>
                    <img src={logo} alt="" />
                </div>
                <div
                    className={classNames(
                        styles.headerNavigation,
                        // focused.toString() === 'true' && styles.headerNavigationHidden,
                    )}
                >
                    <ul className={styles.nav}>
                        {navs.map((item, index) => (
                            <li key={index}>
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(item.to);
                                    }}
                                >
                                    {item.title}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className={styles.navProfile}>
                <SearchBox />
                <li style={{ paddingTop: '5px' }}>
                    <AppCart />
                </li>
                <li
                    style={{ paddingTop: '5px' }}
                    onClick={() => navigate(isAuthenticated ? '/history-order' : '/history-order-guest')}
                >
                    <Tooltip title="Lịch sử đặt hàng">
                        <IconTruckDelivery size={30} style={{ color: '#f57e20' }} />
                    </Tooltip>
                </li>
                {accessToken ? (
                    <>
                        <li style={{ paddingTop: '5px' }}>
                            <NotificationDropDown
                                data={
                                    dataMyNotification
                                        ? dataMyNotification?.listNotification
                                        : notification?.listNotification
                                }
                                executeGetData={executeGetDataMyNotification}
                                executeUpdateState={executeUpdateState}
                                loading={loadingDataMyNotification}
                                unReadTotal={
                                    dataMyNotification ? dataMyNotification?.unReadTotal : notification?.unReadTotal
                                }
                                pageTotal={dataMyNotification ? dataMyNotification?.pageTotal : notification?.pageTotal}
                            />
                        </li>
                    </>
                ) : null}

                {accessToken ? (
                    <div style={{ paddingTop: 5 }}>
                        <ProfileDropDown openLogin={openLogin} />
                    </div>
                ) : (
                    <>
                        <div>
                            <Flex gap={8} align="center">
                                <Avatar icon={<IconUser />} />
                                <Flex
                                    align={'start'}
                                    vertical
                                    style={{ width: 'max-content', cursor: 'pointer' }}
                                    onClick={(e) => navigate('/login')}
                                >
                                    <span>{translate.formatMessage(message.login)}</span>
                                    <span>{translate.formatMessage(message.signup)}</span>
                                </Flex>
                            </Flex>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default DefaultComponent;
