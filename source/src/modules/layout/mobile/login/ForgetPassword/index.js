import BasicForm from '@components/common/form/BasicForm';
import React, { useState } from 'react';
import styles from './index.module.scss';
import * as yup from 'yup';
import useFetch from '@hooks/useFetch';
import apiConfig from '@constants/apiConfig';
import useFetchAction from '@hooks/useFetchAction';
import { accountActions } from '@store/actions';
import { setCacheAccessToken } from '@services/userService';
import { toast } from 'react-toastify';
import { defineMessages } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import Typo from '@components/common/elements/Typo';
import { generatePath, useNavigate } from 'react-router-dom';
import routes from '@routes';
import { ReactComponent as Close } from '@assets/icons/close.svg';
import RegisterMobileComponent from '@modules/layout/mobile/login/Register';
import { CLIENT_APP } from '@constants';
const message = defineMessages({
    login: 'Đăng nhập',
    register: 'Đăng ký',
    emailAddress: 'Địa chỉ email',
    password: 'Mật khẩu',
    showPassword: 'Hiện mật khẩu',
    forgetPassword: 'Quên mật khẩu',
    otherLogin: 'Hoặc đăng nhập với',
    emailOrPhone: 'Email/Số điện thoại',
    email: 'Email',
    continue: 'Tiếp tục',
    success: 'Yêu cầu quên mật khẩu thành công, vui lòng kiểm tra email.',
});
const ForgetPasswordMobileComponent = () => {
    const translate = useTranslate();
    const navigate = useNavigate();

    const { execute: resquestForgetPassword, loading: ggLoginloading } = useFetch(
        apiConfig.account.resquestForgetPassword,
    );

    const handleRequestForgetPassword = (values) => {
        resquestForgetPassword({
            data: {
                ...values,
                app: CLIENT_APP,
            },
            onCompleted: (res) => {
                // console.log(res);
                // showInfoMessage(translate.formatMessage(message.success));
                navigate(`${routes.ChangePasswordPage.path}?idHash=${res?.data?.idHash}`);
            },
            onError: (error) => {},
        });
    };
    const [ open, setOpen ] = useState(false);

    return (
        <section className="container">
            <div className={styles?.headerLogin}>
                <Typo size="big" type="bold" style={{ color: 'var(--title-color)' }} className={styles?.title}>
                    {translate.formatMessage(message.forgetPassword)}
                </Typo>
                <i
                    className={styles.iconClose}
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(generatePath(routes.loginPage.path), {
                            state: { action: 'login', prevPath: location.pathname },
                        });
                    }}
                >
                    <Close />
                </i>
            </div>
        </section>
    );
};

export default ForgetPasswordMobileComponent;
