import { ReactComponent as Exit } from '@assets/icons/exit.svg';
import avatar from '@assets/images/avatar_profile.png';
import logo from '@assets/images/icon_logo.png';
import Typo from '@components/common/elements/Typo';
import configPages from '@constants/menuConfig';
import useAuth from '@hooks/useAuth';
import { accountActions } from '@store/actions';
import { IconMenu2 } from '@tabler/icons-react';
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './AppHeader.module.scss';
import NavDrawer from './NavDrawer';
import { ReactComponent as Login } from '@assets/icons/login.svg';
import { ReactComponent as Signup } from '@assets/icons/reg.svg';

import { ReactComponent as Cart } from '@assets/icons/carIcon.svg';
import { ReactComponent as Search } from '@assets/icons/search.svg';

import { AppConstants, GROUP_KIND_EXPERT, GROUP_KIND_SELLER, GROUP_KIND_STUDENT, storageKeys } from '@constants';
import { removeCacheToken } from '@services/userService';
import { getData } from '@utils/localStorage';
import { defineMessages, useIntl } from 'react-intl';
import useDisclosure from '@hooks/useDisclosure';
import RegisterMobileComponent from '@modules/layout/mobile/login/Register';
import { useEffect } from 'react';
import useTranslate from '@hooks/useTranslate';
import { copyToClipboard, disableBrowserBack } from '@utils';
import { ReactComponent as Copy } from '@assets/icons/copy.svg';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import SearchBar from './SearchBar';
import routes from '@routes';
import { Avatar, Badge, Flex, Modal, Space } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
const message = defineMessages({
    login: 'Đăng nhập',
    signUp: 'Đăng ký',
    logout: 'Đăng xuất',
    copy: 'Sao chép mã giới thiệu',
});
const AppHeader = () => {
    const intl = useIntl();
    const [ isTopZero, setIsTopZero ] = useState(true);
    const params = useLocation();

    const [ open, setOpen ] = useState(false);
    const navigate = useNavigate();
    const { profile } = useAuth();
    const dispatch = useDispatch();
    const location = useLocation();
    const onLogout = () => {
        removeCacheToken();
        dispatch(accountActions.logout());
        setOpen(false);
        // window.location.reload();
    };
    const onNext = async () => {
        navigate('/');
        // disableBrowserBack();
        closeSearch();
        // history.replace('/');
    };

    const queryParameters = new URLSearchParams(window.location.search);
    const query = queryParameters.get('query');

    const translate = useTranslate();

    const [ openedRegsiter, { open: openRegsiter, close: closeRegsiter } ] = useDisclosure(false);
    const [ openedSearch, { open: openSearch, close: closeSearch } ] = useDisclosure(false);

    useEffect(() => {
        if (queryParameters.get('isRegisterStudent') === 'true' && !profile) openRegsiter();
    }, []);

    const numberCart = useSelector((state) => state.cart.cart);
    const LogoutConfirm = () => {
        Modal.confirm({
            // title: (
            //     <Typo size="small" type="semi-bold" style={{ color: 'var(--primary-color)' }}>
            //         <FormattedMessage defaultMessage={'Đăng xuất'} />
            //     </Typo>
            // ),
            // children: (
            //     <Typo size="sub">
            //         <FormattedMessage defaultMessage={'Bạn muốn đăng xuất khỏi tài khoản này?'} />
            //     </Typo>
            // ),
            // size: '80vw',
            // centered: true,
            // zIndex: 9999,
            // withCloseButton: false,
            // labels: { confirm: 'Đăng xuất', cancel: 'Hủy' },
            // onConfirm: () => onLogout(),
            title: 'Đăng xuất',
            icon: <ExclamationCircleFilled />,
            content: 'Bạn muốn đăng xuất khỏi tài khoản này?',
            onOk() {
                onLogout();
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    const handleOpenRegster = () => {
        openRegsiter();
        setOpen(false);
    };

    return (
        <div
            className={classNames(styles.appHeader, styles.appHeaderMobile)}
            id=""
            style={{ boxShadow: '0px 0px 5px 0px #00acc1' }}
        >
            <Flex justify="space-between" align="center">
                <div
                    style={{
                        width: '20%',
                        lineHeight: 1,
                        paddingLeft: 14,
                    }}
                >
                    <IconMenu2
                        size={35}
                        style={{ cursor: 'pointer' }}
                        className={styles.hamburger}
                        alt=""
                        onClick={() => setOpen(true)}
                        color="var(--primary-color)"
                    />
                </div>
                <Flex justify={'center'} style={{ width: '60%' }}>
                    <div onClick={onNext} className={styles.logo}>
                        <img src={logo} alt="" style={{ width: '100%', marginTop: '5px' }} />
                    </div>
                </Flex>
                <Flex justify="end" wrap="no-wrap" gap={10} style={{ lineHeight: 1, width: '20%', paddingRight: 18 }}>
                    {location?.pathname == routes?.SearchPage?.path ? (
                        <></>
                    ) : (
                        <div
                            id="open-search"
                            onClick={() => {
                                if (openedSearch) {
                                    closeSearch();
                                } else {
                                    openSearch();
                                    document.getElementById('search-input')?.focus();
                                }
                            }}
                        >
                            <Search width="27px" height="25px" />
                        </div>
                    )}
                    {/* <Link to="/cart" width="4px" height="25px">
                        <Cart width="27px" height="25px" color={'var(--primary-color)'} />
                    </Link> */}
                    <Badge
                        inline
                        count={
                            <Space
                                size={10}
                                style={{ color: numberCart?.length > 0 ? 'white' : 'var(--primary-color)' }}
                            >
                                {numberCart?.length}
                            </Space>
                        }
                        size={16}
                        // color="#D9D9D9"
                        color={numberCart?.length > 0 ? 'red' : '#D9D9D9'}
                    >
                        <Link to="/cart" width="4px" height="25px">
                            <Cart
                                width="27px"
                                height="25px"
                                color={numberCart?.length > 0 ? 'var(--primary-color)' : '#9C9C9C'}
                            />
                        </Link>
                    </Badge>
                </Flex>
            </Flex>
            <NavDrawer open={open} onClose={() => setOpen(false)} headerTitle="Menu">
                <ul className={styles.nav}>
                    {profile && (
                        <Flex vertical align="start" justify="center">
                            <Link to="/profile" onClick={() => setOpen(false)}>
                                <Space style={{ padding: '0px 10px 10px', borderBottom: '1.2px solid #e3e3e3' }}>
                                    <Flex justify="center" align="center">
                                        <Avatar
                                            src={
                                                profile?.account?.avatar?.includes('https') ||
                                                profile?.account?.avatar == undefined
                                                    ? avatar
                                                    : AppConstants.contentRootUrl + profile?.account?.avatar
                                            }
                                            size={60}
                                            style={{
                                                borderRadius: '50%',
                                                border: '1px solid #00acc1',
                                            }}
                                        />

                                        <Flex vertical style={{ marginLeft: 10 }}>
                                            <span
                                                style={{
                                                    fontSize: 'var(--primary-font-size)',
                                                    fontWeight: 'var(--font-bold)',
                                                    color: 'var(--primary-color)',
                                                }}
                                            >
                                                {profile?.fullName}
                                            </span>

                                            <span
                                                style={{
                                                    fontSize: 'var(--sub-font-size)',
                                                    marginTop: 5,
                                                    color: 'dimmed',
                                                }}
                                            >
                                                {profile?.email}
                                            </span>
                                        </Flex>
                                    </Flex>
                                </Space>
                            </Link>
                            {configPages.map((item, index) => {
                                return (
                                    <div onClick={() => setOpen(false)} key={item.key}>
                                        <Link to={`/profile?content=${item.key}`}>
                                            <Space
                                                style={{ padding: '20px 10px', borderBottom: '1.2px solid #e3e3e3' }}
                                            >
                                                <Flex align="center" gap={8}>
                                                    <Flex h={40} c="var(--content-color)">
                                                        <i className={styles.iconMenu}>{item.icon}</i>
                                                    </Flex>
                                                    <span
                                                        style={{
                                                            fontSize: 'var(--primary-font-size)',
                                                            color: 'var(--content-color)',
                                                            fontWeight: 'var(--font-semi-bold)',
                                                        }}
                                                    >
                                                        {item.title}
                                                    </span>
                                                </Flex>
                                            </Space>
                                            {/* <Divider /> */}
                                        </Link>
                                    </div>
                                );
                            })}
                            <Space
                                onClick={() => LogoutConfirm()}
                                style={{ cursor: 'pointer', padding: '20px 10px', borderBottom: '1.2px solid #e3e3e3' }}
                            >
                                <Flex align="center" gap={8} justify="center">
                                    <div className={styles.iconMenu}>
                                        <Exit color="var(--text-color)" />
                                    </div>
                                    <span
                                        style={{
                                            fontSize: 'var(--primary-font-size)',
                                            color: 'var(--content-color)',
                                            fontWeight: 'var(--font-semi-bold)',
                                        }}
                                    >
                                        {intl.formatMessage(message.logout)}
                                    </span>
                                </Flex>
                            </Space>
                        </Flex>
                    )}
                </ul>
            </NavDrawer>
        </div>
    );
};

export default AppHeader;
