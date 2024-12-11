import React, { useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { Button, ConfigProvider, Flex, Form, Image, Input, Typography } from 'antd';

import apiConfig from '@constants/apiConfig';
import { setCacheAccessToken } from '@services/userService';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import InputTextField from '@components/common/form/InputTextField';
import styles from './index.module.scss';
import { accountActions } from '@store/actions';
import useAuth from '@hooks/useAuth';
import useFetch from '@hooks/useFetch';
import useFetchAction from '@hooks/useFetchAction';
import { showErrorMessage } from '@services/notifyService';
import { appAccount, appName, storageKeys } from '@constants';
import { commonMessage } from '@locales/intl';
import { Buffer } from 'buffer';
import useTranslate from '@hooks/useTranslate';
import { setData } from '@utils/localStorage';
import useNotification from '@hooks/useNotification';
import { Link, useNavigate } from 'react-router-dom';
import InputOtpField from '@components/common/form/InputOtpField';
import { checkOtp, checkPassword, checkUserName } from '@utils';
import imgContact from '@assets/images/imgContact.png';
import logo from '@assets/images/logoTech.png';
import './style.css';
import useDisclosure from '@hooks/useDisclosure';
import ForgetPassModal from './ForgetPassModal';

const { Title } = Typography;

window.Buffer = window.Buffer || Buffer;
const message = defineMessages({
    copyRight: '{brandName} - © Copyright {year}. All Rights Reserved',
    youAre: 'Bạn là?',
    login: 'Đăng nhập',
    forgetpassword: 'Quên mật khẩu',
    noAccount: 'Bạn chưa có tài khoản?',
    required: 'Yêu cầu ngay',
    loginFail: 'Sai tên đăng nhập hoặc mật khẩu !!!',
    verifyFailOTP: 'Mã OTP không đúng!!!',
    verifySuccessOTP: 'Xác thực OTP thành công!!!',
    loginNoAccess: 'Loại tài khoản không phù hợp!!!',
    username: 'Username',
    otp: 'OTP',
    password: 'Password',
    cancel: 'Hủy',
});

const LoginDesktop = () => {
    const [ isMfaSSO, setIsMfaSSO ] = useState(null);
    const [ urlSSO, setUrlSSO ] = useState(null);
    const [ inforUser, setInforUser ] = useState({});
    const [ otpValue, setOtpValue ] = useState('');
    const [ form ] = Form.useForm();
    const [ openedDetailsModal, handlerDetailsModal ] = useDisclosure(false);
    const intl = useIntl();
    const navigate = useNavigate();
    const translate = useTranslate();
    const base64Credentials = Buffer.from(`${appAccount.APP_USERNAME}:${appAccount.APP_PASSWORD}`).toString('base64');
    const { execute, loading } = useFetch({
        ...apiConfig.account.loginBasic,
        authorization: `Basic ${base64Credentials}`,
    });
    const { execute: executeSSO, loading: loadingSSO } = useFetch({
        ...apiConfig.account.loginSSO,
    });
    const { execute: executeGetProfile } = useFetchAction(accountActions.getProfile, {
        loading: useFetchAction.LOADING_TYPE.APP,
    });
    const onFinish = () => {
        const values = form.getFieldsValue();
        execute({
            data: {
                ...values,
                grant_type: 'password',
            },
            onCompleted: (res) => {
                setCacheAccessToken(res.access_token);
                navigate('/');
            },
            onError: (error) => {
                showErrorMessage('Tên đăng nhập hoặc mật khẩu không chính xác!');
                console.log(error.message);
            },
        });
    };
    const handleForgotPasswordClick = () => {
        handlerDetailsModal.open();
    };

    const handleLoginSuccess = (res) => {
        setCacheAccessToken(res.access_token);
        setData(storageKeys.USER_KIND, res.user_kind);
        executeGetProfile();
    };

    const customStyles = {
        // Các thuộc tính CSS bạn muốn áp dụng cho Input
        // Ví dụ:
        width: '300px',
        borderRadius: '8px',
        border: '1px solid #ccc',
        fontSize: 400,
    };
    var reWhiteSpace = new RegExp('/^s+$/');
    return (
        <div className={styles.loginPage}>
            <ForgetPassModal open={openedDetailsModal} onCancel={() => handlerDetailsModal.close()} form={form} />

            <Flex justify="space-between" align="center" style={{ width: '90vw', margin: '40px 0px 80px' }}>
                <div className="nav-left">
                    <Link to="/">
                        <img width="300" height="80" src={logo} alt="Tech-market" />
                    </Link>
                </div>
                <div className="nav-right">
                    <ul>
                        <li className="active">
                            <Link to="/">Trang chủ</Link>
                        </li>
                        <li>
                            <Link to="/introduction">Giới thiệu</Link>
                        </li>
                        <li>
                            <Link to="/">Sản phẩm</Link>
                        </li>
                        <li>
                            <Link to="#">Liên hệ</Link>
                        </li>
                    </ul>
                </div>
                {/* <nav className="nav">
                </nav> */}
            </Flex>
            <Flex gap={16}>
                <div className={styles.loginFormLeft}>
                    <Title level={3} className={styles.customTitle}>
                        {intl.formatMessage(commonMessage.login)}
                    </Title>
                    <Form
                        style={{ padding: '0px 40px' }}
                        form={form}
                        name="login-form"
                        onFinish={(value) => console.log(value)}
                        layout="vertical"
                    >
                        <div className={styles.inputContainer}>
                            <InputTextField
                                name="username"
                                className={styles.customInput}
                                label={
                                    <div
                                        style={{
                                            fontSize: 16,
                                            fontWeight: '500',
                                            marginTop: 25,
                                            color: '#fff',
                                        }}
                                    >
                                        {intl.formatMessage(commonMessage.username)}
                                    </div>
                                }
                                placeholder={intl.formatMessage(commonMessage.phoneAndEmail)}
                                size="large"
                                rules={[
                                    {
                                        validator: checkUserName,
                                    },
                                ]}
                            />
                        </div>
                        <div className={styles.inputContainer}>
                            <InputTextField
                                name="password"
                                className={styles.customInput}
                                label={
                                    <div
                                        style={{
                                            fontSize: 16,
                                            fontWeight: '500',
                                            marginBottom: 5,
                                            marginLeft: 0,
                                            color: '#fff',
                                        }}
                                    >
                                        {intl.formatMessage(commonMessage.password)}
                                    </div>
                                }
                                placeholder={intl.formatMessage(commonMessage.passWord)}
                                size="large"
                                type="password"
                                // rules={[
                                //     {
                                //         validator: checkPassword,
                                //     },
                                // ]}
                            />
                        </div>
                        <div className={styles.forgotPassword} onClick={handleForgotPasswordClick}>
                            <a href="#" onClick={handleForgotPasswordClick}>
                                Quên mật khẩu?
                            </a>
                        </div>
                        <Button
                            type="primary"
                            size="large"
                            loading={loading}
                            // htmlType="submit"
                            style={{
                                width: '100%',
                                height: '58px',
                                fontWeight: '520',
                                background: '#389cfb',
                                margin: '5px 0px 18px 0px',
                                borderRadius: '12px',
                            }}
                            onClick={() => {
                                onFinish();
                            }}
                        >
                            {intl.formatMessage(commonMessage.login)}
                        </Button>

                        <div className={styles.bottom}>
                            <div className={styles.noAccount}>Bạn chưa có tài khoản?</div>
                            <Link to="/sign-up" className={styles.request}>
                                Đăng ký
                            </Link>
                        </div>
                    </Form>
                </div>
                <div className={styles.loginFormRight}>
                    <Image
                        src={imgContact}
                        style={{ objectFit: 'cover', borderRadius: 20 }}
                        preview={false}
                        className={styles.image}
                    />
                </div>
            </Flex>
        </div>
    );
};

export default LoginDesktop;
