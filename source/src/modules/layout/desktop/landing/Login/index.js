import iconGoogle from '@assets/icons/brandGoogle.svg';
import { GROUP_KIND_SELLER, GROUP_KIND_STUDENT, appAccount, storageKeys } from '@constants';
import apiConfig from '@constants/apiConfig';
import useFetch from '@hooks/useFetch';
import useFetchAction from '@hooks/useFetchAction';
import useTranslate from '@hooks/useTranslate';
import { showErrorMessage, showSucsessMessage } from '@services/notifyService';
import { setCacheAccessToken } from '@services/userService';
import { accountActions } from '@store/actions';
import { getData, setData } from '@utils/localStorage';
import { Buffer } from 'buffer';
import React from 'react';
import { defineMessages } from 'react-intl';
import styles from './index.module.scss';

import { actions, hideAppLoginModal } from '@store/actions/app';
import { removeItem } from '@utils/localStorage';
import { useDispatch, useSelector } from 'react-redux';
import { commonMessage, commonValidation } from '@constants/intl';
import useDisclosure from '@hooks/useDisclosure';
import { useNavigate } from 'react-router-dom';
import { validateEmailPhoneInput, validatePasswordInput } from '@utils';
window.Buffer = window.Buffer || Buffer;
const message = defineMessages({
    login: 'Đăng nhập',
    phone: 'Số điện thoại / Email',
    emailAddress: 'Địa chỉ email',
    password: 'Mật khẩu',
    enterPassword: 'Nhập mật khẩu',
    enterPhone: 'Nhập Số điện thoại / Email',
    showPassword: 'Hiện mật khẩu',
    forgetPassword: 'Quên mật khẩu',
    otherLogin: 'Hoặc đăng nhập với',
    register: 'Đăng ký',
    loginSuccess: 'Đăng nhập thành công',
    loginFail: 'Số điện thoại hoặc mật khẩu không chính xác',
});
const ModalLoginForm = ({ isOpenRegister, isCloseLogin, isOpenForgetPassword, login, loginFaceBook }) => {
    const translate = useTranslate();
    const dispatch = useDispatch();
    const [ openedError, { open: openError, close: closeError } ] = useDisclosure(false);

    const base64Credentials = Buffer.from(`${appAccount.APP_USERNAME}:${appAccount.APP_PASSWORD}`).toString('base64');
    const { execute, loading } = useFetch({
        ...apiConfig.account.loginBasic,
        authorization: `Basic ${base64Credentials}`,
    });
    const { execute: executeGetProfile } = useFetchAction(accountActions.getProfile, {
        loading: useFetchAction.LOADING_TYPE.APP,
    });
    const { execute: executeGetSellerProfile } = useFetchAction(accountActions.getSellerProfile, {
        loading: useFetchAction.LOADING_TYPE.APP,
    });

    const handleRegisterClick = (closeLogin, openRegister) => {
        closeLogin();
        openRegister();
    };
    const handleForgetPasswordClick = (closeLogin, openForgetPassword) => {
        closeLogin();
        openForgetPassword();
    };
   
    const onFinish = (values) => {
        dispatch(actions.showAppLoading());
        execute({
            data: { ...values, grant_type: 'student' },
            onCompleted: (res) => {
                // setCacheAccessToken(res.access_token);
                // executeGetProfile();
                dispatch(actions.hideAppLoading());
                // showSucsessMessage(res);
            },
            onError: (res) => {
                if (res.access_token) {
                  
                    removeItem(storageKeys.REF_CODE);
                    if (res.user_kind === GROUP_KIND_STUDENT && res.is_seller) {
                        setCacheAccessToken(res.access_token);
                        executeGetSellerProfile();
                        setData(storageKeys.USER_KIND, GROUP_KIND_SELLER);
                        // showSucsessMessage(translate.formatMessage(message.loginSuccess));
                        dispatch(hideAppLoginModal({}));
                        closeError();


                       
                       

                    } else if (res.user_kind === GROUP_KIND_STUDENT) {
                        setCacheAccessToken(res.access_token);
                        executeGetProfile();
                        setData(storageKeys.USER_KIND, GROUP_KIND_STUDENT);
                        // showSucsessMessage(translate.formatMessage(message.loginSuccess));
                        dispatch(hideAppLoginModal({}));
                        closeError();
                       
                    } else {
                        // showErrorMessage(translate.formatMessage(message.loginFail));
                    }
                    dispatch(actions.hideAppLoading());
                } else {
                    dispatch(actions.hideAppLoading());
                    openError();
                }
            },
        });
    };


    return (
        <div>
            <form>
                <input
                    label={translate.formatMessage(message.phone)}
                    placeholder={translate.formatMessage(message.enterPhone)}
                />
                <input
                    label={translate.formatMessage(message.password)}
                    placeholder={translate.formatMessage(message.enterPassword)}
                />

                <div>
                    <button
                        type="submit"
                        radius="md"
                    >
                        {translate.formatMessage(message.login)}
                    </button>
                </div>
            </form>
            <div>
                <div
                    className={styles.forgetPassword}
                    onClick={() => handleForgetPasswordClick(isCloseLogin, isOpenForgetPassword)}
                >
                    {translate.formatMessage(message.forgetPassword)}
                </div>
                <div className={styles.btnRegister} onClick={() => handleRegisterClick(isCloseLogin, isOpenRegister)}>
                    {translate.formatMessage(message.register)}
                </div>
            </div>
            <div className={styles.otherLogin}>
                <span>{translate.formatMessage(message.otherLogin)}</span>
            </div>
            <div>
                <button
                    onClick={() => login()}
                    color={'#DC2626'}
                    radius="lg"
                >
                    Google
                </button>
            </div>
        </div>
    );
};

export default ModalLoginForm;
