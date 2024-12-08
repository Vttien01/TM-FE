import React, { useEffect, useState } from 'react';
import styles from './AppHeader.module.scss';
import DefaultComponent from './Header/DefaultComponent';
import ModalForgetPassword from './ModalForgetPassword';
import ModalLogin from './ModalLogin';
import ModalRegister from './ModalRegister';
import { useDispatch, useSelector } from 'react-redux';
import { selectHeaderType, selectHeaderTypePreview } from '@selectors/app';
import classNames from 'classnames';
import DetailComponent from './Header/DetailComponent';
import { CSSTransition } from 'react-transition-group';
import ModalProfile from './ModalProfile';
import ModalConfirm from './ModalConfirm';
import useFetch from '@hooks/useFetch';
import apiConfig from '@constants/apiConfig';
import { setCacheAccessToken } from '@services/userService';
import { AppConstants, GROUP_KIND_STUDENT, storageKeys } from '@constants';
import { setData } from '@utils/localStorage';
import { showSucsessMessage } from '@services/notifyService';
import useFetchAction from '@hooks/useFetchAction';
import { accountActions, appActions } from '@store/actions';
import ModalFbRegister from '@modules/layout/desktop/landing/Login/ModalFbRegister';
import { useGoogleLogin } from '@react-oauth/google';
import ModalGgRegister from '@modules/layout/desktop/landing/Login/ModalGoogleRegister';
import ModalChangePasswordForgetPassword from './ModalChangePasswordForgetPassword ';
import { USER_EMAIL_GG_EXISTS, errorMessage } from '@constants/ErrorCode';
import { showErrorMessage, showInfoMessage, showWarningMessage } from '@services/notifyService';
import useTranslate from '@hooks/useTranslate';
import { hideAppLoginModal, showAppLoginModal } from '@store/actions/app';
import useAuth from '@hooks/useAuth';
const AppHeader = () => {
    const isDefaultHeader = useSelector(selectHeaderType);
    const { execute: executeGetProfile } = useFetchAction(accountActions.getProfile, {
        loading: useFetchAction.LOADING_TYPE.APP,
    });
    const [ openprofile, setOpenedProfile ] = useState(false);
    const { execute: fbLogin, loading: fbLoginloading } = useFetch(apiConfig.student.LoginFaceBook);
    const [ dataFacebook, setDataFacebook ] = useState({});
    const queryParameters = new URLSearchParams(window.location.search);
    const translate = useTranslate();
    const dispatch = useDispatch();
    const loginFaceBookFunc = (fbres) => {
        fbLogin({
            data: { token: fbres?.accessToken },
            onCompleted: (res) => {
                if (res?.data?.accessToken?.access_token) {
                    if (res.data?.accessToken?.user_kind === GROUP_KIND_STUDENT) {
                        setCacheAccessToken(res.data.accessToken.access_token);
                        executeGetProfile();
                        setData(storageKeys.USER_KIND, GROUP_KIND_STUDENT);
                    }
                } else {
                    setDataFacebook(res);
                    setOpenedProfile(true);
                }
            },
            onError: (res) => {},
        });
    };
    const openModalLogin = () => {
        dispatch(showAppLoginModal({}));
    };
    const closeModalLogin = () => {
        dispatch(appActions.setBuyCourseDirect(false));
        dispatch(appActions.setPayment(false));
        dispatch(hideAppLoginModal({}));
    };
    const appLogin = useSelector((state) => state.app.loginModal);
    const [ openProfileGG, setOpenedProfileGg ] = useState(false);
    const [ ggData, setGGData ] = useState({});
    const { execute: ggLogin, loading: ggLoginloading } = useFetch(apiConfig.student.loginGoogle);
    const [ idCode, setIdCode ] = useState({});
    const { execute: excuteTokenResponse, loading: tokenLoading } = useFetch(apiConfig.student.oauth2Google);

    const loginGoogleFunc = (ggres) => {
        ggLogin({
            data: { token: ggres?.access_token },
            onCompleted: (res) => {
                setGGData(res.data);
                if (res?.data?.accessToken?.access_token) {
                    if (res?.data?.accessToken?.user_kind === GROUP_KIND_STUDENT) {
                        setCacheAccessToken(res.data.accessToken.access_token);
                        executeGetProfile();
                        setData(storageKeys.USER_KIND, GROUP_KIND_STUDENT);
                        closeModalLogin();
                    }
                } else {
                    setOpenedProfileGg(true);
                }
            },

            onError: (error) => {
                error?.response?.data?.code == USER_EMAIL_GG_EXISTS
                    ? showErrorMessage(translate.formatMessage(errorMessage.USER_EMAIL_GG_EXISTS))
                    : '';
            },
        });
    };

    const login = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            excuteTokenResponse({
                params: {
                    client_id: AppConstants.GGClientId,
                    client_secret: AppConstants.GGClienSecret,
                    redirect_uri: AppConstants.GGRedirectURI,
                    grant_type: 'authorization_code',
                    code: tokenResponse.code,
                },
                onError: (res) => {
                    closeModalLogin();
                    loginGoogleFunc(res);
                },
            });
        },
        flow: 'auth-code',
    });

    const { data: reviewData, execute: executeReviewData } = useFetch(apiConfig.review.myReview, {
        // immediate: true,
        mappingData: (res) => {
            return res?.data.content[0];
        },
    });

    return (
        <>
            <div id="header" className={classNames(styles.appHeader, !isDefaultHeader && styles.appHeaderDetail)}>
                <div style={{ display: 'flex', alignContent: 'center', height: '100%' }}>
                    <DefaultComponent />

                    {/* <CSSTransition
                        in={!isDefaultHeader}
                        // timeout={200}
                        classNames={{
                            enter: styles.detailEnter,
                            enterActive: styles.detailEnterActive,
                            exit: styles.detailExit,
                            exitActive: styles.detailExitActive,
                        }}
                        mountOnEnter
                        unmountOnExit
                    >
                        <DetailComponent reviewData={reviewData} executeReviewData={executeReviewData} isPreview={isPreview}/>
                    </CSSTransition>
                    <CSSTransition
                        in={isDefaultHeader}
                        // timeout={200}
                        classNames={{
                            enter: styles.detailEnter,
                            enterActive: styles.detailEnterActive,
                            exit: styles.detailExit,
                            exitActive: styles.detailExitActive,
                        }}
                        mountOnEnter
                        unmountOnExit
                    >
                        <DefaultComponent/>
                    </CSSTransition> */}
                </div>
                {/* <ModalProfile/> */}
                <ModalFbRegister
                    opened={openprofile}
                    close={() => setOpenedProfile(false)}
                    dataFacebook={dataFacebook}
                />
            </div>
        </>
    );
};

export default AppHeader;
