import { ReactComponent as Close } from '@assets/icons/close.svg';
import Typo from '@components/common/elements/Typo';
import { ACCOUNT_ERROR_OPT_INVALID, errorMessage } from '@constants/ErrorCode';
import apiConfig from '@constants/apiConfig';
import useFetch from '@hooks/useFetch';
import useQueryParams from '@hooks/useQueryParams';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import { showSucsessMessage } from '@services/notifyService';
import React, { useMemo } from 'react';
import { defineMessages } from 'react-intl';
import { generatePath, useNavigate } from 'react-router-dom';
import styles from './index.module.scss';
import { validatePasswordInput } from '@utils';
const message = defineMessages({
    login: 'Đăng nhập',
    register: 'Đăng ký',
    emailAddress: 'Địa chỉ email',
    password: 'Mật khẩu',
    showPassword: 'Hiện mật khẩu',
    forgetPassword: "Tạo mật khẩu mới",
    otherLogin: 'Hoặc đăng nhập với',
    emailOrPhone: 'Email',
    continue: 'Tiếp tục',
    newPassword: 'Mật khẩu mới',
    confirmNewPassword: 'Nhập lại mật khẩu mới',
    confirmPassword: 'Nhập lại mật khẩu',
    enterPassword: 'Nhập mật khẩu',
    enterNewPassword: 'Nhập mật khẩu mới',
    fullName: 'Họ và tên',
    phone: 'Số điện thoại',
    otp: 'Mã xác thực',
    validateConfirmPassword: 'Mật khẩu không trùng khớp',
    lengthPassword: 'Độ dài mật khẩu tối thiểu 6 kí tự ',
    changePasswordSuccess: 'Đổi mật khẩu thành công',
});
const ChangePasswordMobileComponent = () => {
    const translate = useTranslate();
    const navigate = useNavigate();

    const { execute: ForgetPassword, loading: forgetPasswordloading } = useFetch(apiConfig.account.forgetPassword);
    const { deserializeParams, serializeParams, params } = useQueryParams();
    const queryFilter = useMemo(() => deserializeParams(params), [ params ]);

    const _idhash = queryFilter?.idHash;
    const idHash = _idhash.replace(/ /g, '+');

    const handleRequestForgetPassword = (values) => {
        ForgetPassword({
            data: {
                ...values,
                ...(idHash && { idHash: idHash }),
            },
            onCompleted: (res) => {
                showSucsessMessage(translate.formatMessage(message.changePasswordSuccess));
                navigate(routes.loginPage.path);
            },
            onError: (error) => {
                // error?.response?.data?.code == ACCOUNT_ERROR_OPT_INVALID
                //     ? showErrorMessage(translate.formatMessage(errorMessage.ACCOUNT_ERROR_OPT_INVALID))
                //     : '';

            },
        });
    };

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

export default ChangePasswordMobileComponent;
