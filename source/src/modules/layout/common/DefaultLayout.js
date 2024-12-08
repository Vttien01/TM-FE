import React, { Fragment, useState } from 'react';

import AppHeader from './desktop/AppHeader';
import AppHeaderMobile from './mobile/AppHeader';

import styles from './DefaultLayout.module.scss';
import AppBody from './AppBody';
import AppFooter from './AppFooter';
import useDevices from '@hooks/useDevices';
import useFetch from '@hooks/useFetch';
import apiConfig from '@constants/apiConfig';
import { removeCacheAccessToken, setCacheAccessToken } from '@services/userService';
import { useDispatch } from 'react-redux';
import { accountActions } from '@store/actions';
import { toast } from 'react-toastify';
import useAuth from '@hooks/useAuth';
import useFetchAction from '@hooks/useFetchAction';
import AppFooterMobile from './mobile/Footer/appFooterMobile';

const DefaultLayout = ({ children }) => {
    const { isMobile } = useDevices();
    const { execute: executeLogout } = useFetch(apiConfig.account.logout);
    const { execute } = useFetch(apiConfig.account.login);
    const { execute: executeGetProfile, isLoading } = useFetchAction(accountActions.getProfile, {
        loading: useFetchAction.LOADING_TYPE.APP,
    });
    const { execute: executeUploadImage } = useFetch(apiConfig.file.upload);
    const { execute: executeUpdateProfile, loading } = useFetch(apiConfig.account.updateProfile, {});
    const dispatch = useDispatch();
    const { profile } = useAuth();
    const [ openModal, setOpen ] = useState(false);
    const [ openModalProfile, setOpenProfile ] = useState(false);
    const onLogout = () => {
        executeLogout({
            onCompleted: () => {
                try {
                    removeCacheAccessToken();
                    dispatch(accountActions.logout());
                    window.location.reload();
                } catch (error) {
                    toast.error('Đăng xuất thất bại !');
                }
            },
        });
    };
    const handleLogin = (values) => {
        execute({
            data: {
                username: values.username,
                password: values.password,
            },
            onCompleted: (res) => {
                try {
                    const { result, data } = res;
                    if (result && data) {
                        setCacheAccessToken(data.token);
                        executeGetProfile({ params: { token: data.token } });
                        setOpen(false);
                    }
                } catch (error) {
                    toast.error('Đăng nhập thất bại');
                }
            },
            onError: ({ message }) => {
                toast.error(message);
            },
        });
    };
    const handleSubmitProfile = (value, image) => {
        executeUpdateProfile({
            data: {
                ...value,
                id: profile.id,
                avatarPath: image,
            },
            onCompleted: (res) => {
                toast.success('Update profile success !');
                executeGetProfile();
                setOpenProfile(false);
            },
            onError: (err) => toast.error('Update profile fail !'),
        });
    };
    return (
        <Fragment>
            {isMobile ? (
                <div className={styles.masterLayoutMobile} id="layoutMobile">
                    <AppHeaderMobile onLogout={onLogout} profile={profile} />
                    <AppBody width="100%" className={styles.mainMobile}>
                        {children}
                    </AppBody>
                    <AppFooterMobile />
                </div>
            ) : (
                <div className={styles.masterLayout} id="layout">
                    <AppHeader
                        onLogout={onLogout}
                        profile={profile}
                        handleLogin={handleLogin}
                        openModal={openModal}
                        setOpen={setOpen}
                        openModalProfile={openModalProfile}
                        setOpenProfile={setOpenProfile}
                        executeUploadImage={executeUploadImage}
                        handleSubmitProfile={handleSubmitProfile}
                    />
                    <AppBody className={styles.main}>{children}</AppBody>
                    <AppFooter />
                </div>
            )}
        </Fragment>
    );
};

export default DefaultLayout;
