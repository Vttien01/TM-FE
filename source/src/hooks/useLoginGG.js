import React, { useState } from 'react';
import {
    AppConstants,
    GROUP_KIND_EXPERT,
    GROUP_KIND_SELLER,
    GROUP_KIND_STUDENT,
    appAccount,
    storageKeys,
} from '@constants';
import useFetch from '@hooks/useFetch';
import apiConfig from '@constants/apiConfig';
import useFetchAction from '@hooks/useFetchAction';
import { accountActions } from '@store/actions';
import { FormattedMessage, defineMessages } from 'react-intl';
import { showErrorMessage, showInfoMessage, showSucsessMessage, showWarningMessage } from '@services/notifyService';
import { setCacheAccessToken } from '@services/userService';
import { getData, setData } from '@utils/localStorage';
import useTranslate from '@hooks/useTranslate';
import { generatePath, useNavigate } from 'react-router-dom';
import routes from '@routes';
import { actions } from '@store/actions/app';
import { useDispatch, useSelector } from 'react-redux';
import { useGoogleLogin } from '@react-oauth/google';
const message = defineMessages({
    registerSuccess: 'Đăng ký thành công',
    registerFail: 'Đăng ký thất bại',
    loginSuccess: 'Đăng nhập thành công',
});
import { removeItem } from '@utils/localStorage';
import { USER_ERROR_GG_EXISTS, errorMessage, USER_EMAIL_GG_EXISTS } from '@constants/ErrorCode';
const useLoginGG = ({ setOpenedProfileGg, setIsRegisterModalOpen }) => {
    const { execute: excuteTokenResponse, loading: tokenLoading } = useFetch(apiConfig.student.oauth2Google);
    const { execute: ggLogin, loading: ggLoginloading } = useFetch(apiConfig.student.loginGoogle);
    const [ ggData, setGGData ] = useState({});
    const { execute: executeGetProfile } = useFetchAction(accountActions.getProfile, {
        loading: useFetchAction.LOADING_TYPE.APP,
    });
    const translate = useTranslate();
    const navigate = useNavigate();
    const loginGoogleFunc = (ggres) => {
        ggLogin({
            data: { token: ggres?.access_token },
            onCompleted: (res) => {
                setGGData(res.data);
                if (res?.data?.accessToken?.access_token) {
                    setCacheAccessToken(res.data.accessToken.access_token);
                    if (res?.data?.accessToken?.user_kind === GROUP_KIND_STUDENT) {
                        executeGetProfile();
                        setData(storageKeys.USER_KIND, GROUP_KIND_STUDENT);
                        showSucsessMessage(translate.formatMessage(message.loginSuccess));
                    }
                } else {
                    if (setOpenedProfileGg) {
                        setOpenedProfileGg(true);
                    } else {
                        setIsRegisterModalOpen(true);
                    }
                    // else {
                    //     console.log(res);
                    //     navigate(
                    //         generatePath(
                    //             `${routes.regGgPage.path}?platformUserId=${res?.data?.platformUserId}&&code=${res?.data?.code}`,
                    //         ),
                    //         {
                    //             state: { action: 'home', prevPath: location.pathname },
                    //         },
                    //     );
                    // }

                    // showSucsessMessage(translate.formatMessage(message.loginSuccess));
                }
            },

            onError: (error) => {
                error?.response?.data?.code == USER_ERROR_GG_EXISTS
                    ? showErrorMessage(translate.formatMessage(errorMessage.USER_ERROR_GG_EXISTS))
                    : '';
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
                onSuccess: (res) => {
                    // console.log(res);
                },
                onError: (res) => {
                    // console.log(res);
                    loginGoogleFunc(res);
                },
            });
        },
        flow: 'auth-code',
    });

    return {
        executeGGRegister: login,
        loading: tokenLoading,
        data: ggData,
        // setIsRegisterModalOpen,
    };
};

export default useLoginGG;
