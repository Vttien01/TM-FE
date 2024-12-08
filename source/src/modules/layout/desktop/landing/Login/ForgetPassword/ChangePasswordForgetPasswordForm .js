import React from 'react';
import styles from './index.module.scss';
import BasicModal from '@components/common/form/BasicModal';
import { FormattedMessage, defineMessages } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import useFetch from '@hooks/useFetch';
import apiConfig from '@constants/apiConfig';
import { showErrorMessage, showInfoMessage, showSucsessMessage } from '@services/notifyService';
import { ACCOUNT_ERROR_OPT_INVALID, errorMessage } from '@constants/ErrorCode';
import { validatePasswordInput } from '@utils';
const message = defineMessages({
    login: 'Đăng nhập',
    otp: 'Mã xác thực',
    register: 'Đăng ký',
    emailAddress: 'Địa chỉ email',
    password: 'Mật khẩu',
    showPassword: 'Hiện mật khẩu',
    forgetPassword: 'Quên mật khẩu',
    otherLogin: 'Hoặc đăng nhập với',
    emailOrPhone: 'Email',
    continue: 'Tiếp tục',
    registerSuccess: 'Đăng ký thành công',
    registerFail: 'Đăng ký thất bại',
    confirmPassword: 'Nhập lại mật khẩu',
    enterPassword: 'Xác nhận',
    fullName: 'Họ và tên',
    phone: 'Số điện thoại',
    changePasswordSuccess: 'Đổi mật khẩu thành công',
    message: 'Mật khẩu không trùng khớp',
    lengthPassword: 'Độ dài mật khẩu tối thiểu 6 kí tự ',
    validateConfirmPassword: 'Mật khẩu không trùng khớp',
    otpWrong: 'Mã xác thực không chính xác',
});
const ChangePasswordForgetPasswordForm = ({ idCode, close, openLogin }) => {
    const translate = useTranslate();


    const { execute: ForgetPassword, loading: ggLoginloading } = useFetch(apiConfig.account.forgetPassword);

    const handleRequestForgetPassword = (values) => {
        ForgetPassword({
            data: {
                ...values,
                ...idCode,
            },
            onCompleted: (res) => {
                showSucsessMessage(translate.formatMessage(message.changePasswordSuccess));
                // showInfoMessage(res?.message);
                close();
                openLogin();
            },
            onError: (error) => {
                // showErrorMessage(res?.message);
            },
        });
    };
    return (
        <form>
            <button
                type="submit"
                radius="md"
            >
                {translate.formatMessage(message.enterPassword)}
            </button>
        </form>
    );
};

export default ChangePasswordForgetPasswordForm;
