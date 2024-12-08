import React from 'react';
import styles from './index.module.scss';
import BasicModal from '@components/common/form/BasicModal';
import { FormattedMessage, defineMessages } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import useFetch from '@hooks/useFetch';
import apiConfig from '@constants/apiConfig';
import { showErrorMessage, showInfoMessage } from '@services/notifyService';
import { ACCOUNT_ERROR_NOT_FOUND, errorMessage } from '@constants/ErrorCode';
import { commonMessage } from '@constants/intl';
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
    changePassword: 'Tiếp tục',
    success: 'Yêu cầu quên mật khẩu thành công, vui lòng kiểm tra email.',
});
const ForgetPasswordForm = ({
    isOpenRegister,
    isOpenLogin,
    isCloseForgetPassword,
    openChangeForgetPassword,
    setIdCode,
    idCode,
}) => {
    const translate = useTranslate();

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
                showInfoMessage(translate.formatMessage(message.success));
                setIdCode(res.data);
                isCloseForgetPassword();
                openChangeForgetPassword();
            },
            onError: (error) => {
            },
        });
    };
    return (
        <div>
            <form>
                <input
                    label={translate.formatMessage(message.email)}
                    placeholder="mail@example.com"
                />
                <div>
                    <button
                        type="submit"
                        radius="md"
                    >
                        {translate.formatMessage(message.changePassword)}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ForgetPasswordForm;
