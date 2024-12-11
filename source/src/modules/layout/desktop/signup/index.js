import { Button, Flex, Form, Image, Typography } from 'antd';
import React, { useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { LockOutlined, UserOutlined } from '@ant-design/icons';
import imgContact from '@assets/images/imgContact.png';
import logo from '@assets/images/logoTech.png';
import DatePickerField from '@components/common/form/DatePickerField';
import InputTextField from '@components/common/form/InputTextField';
import { DATE_FORMAT_DISPLAY, DATE_FORMAT_VALUE, DEFAULT_FORMAT, appAccount } from '@constants';
import apiConfig from '@constants/apiConfig';
import useAuth from '@hooks/useAuth';
import useDisclosure from '@hooks/useDisclosure';
import useFetch from '@hooks/useFetch';
import useFetchAction from '@hooks/useFetchAction';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { showErrorMessage, showSucsessMessage } from '@services/notifyService';
import { accountActions } from '@store/actions';
import { IconCake, IconMailExclamation, IconPhone } from '@tabler/icons-react';
import { formatDateString } from '@utils';
import { Buffer } from 'buffer';
import dayjs from 'dayjs';
import ListDetailsForm from './OtpModal';
import './style.css';
import { Link } from 'react-router-dom';
import styles from './index.module.scss';
import OtpModal from './OtpModal';
const { Title } = Typography;

window.Buffer = window.Buffer || Buffer;
const message = defineMessages({
    copyRight: '{brandName} - © Copyright {year}. All Rights Reserved',
    loginFail: 'Chưa điền đủ các trường thông tin!!!',
    login: 'Đăng nhập',
    signup: 'Đăng ký',
    enterYourFullName: 'Nhập họ tên của bạn',
    enterYourEmail: 'Nhập email của bạn',
    enterYourPhone: 'Nhập số điện thoại của bạn',
});

const SignupPage = () => {
    const intl = useIntl();
    const translate = useTranslate();
    const [ idHash, setidHash ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ openedDetailsModal, handlerDetailsModal ] = useDisclosure(false);
    const base64Credentials = Buffer.from(`${appAccount.APP_USERNAME}:${appAccount.APP_PASSWORD}`).toString('base64');
    const { execute, loading } = useFetch({
        ...apiConfig.user.create,
        authorization: `Basic ${base64Credentials}`,
    });
    const [ form ] = Form.useForm();
    const { execute: executeGetProfile } = useFetchAction(accountActions.getProfile, {
        loading: useFetchAction.LOADING_TYPE.APP,
    });

    const onFinish = (values) => {
        execute({
            data: { ...values, grant_type: 'password' },
            onCompleted: (response) => {
                setidHash(response.data.idHash);
                setEmail(values.email);
                showSucsessMessage(response.message);
                handlerDetailsModal.open();
            },
            onError: ({ response }) => {
                console.log(response);
                showErrorMessage(response?.data?.message || 'Đăng ký không thành công');
            },
        });
    };

    const validateStartDate = (_, value) => {
        const date = dayjs(formatDateString(new Date(), DEFAULT_FORMAT), DATE_FORMAT_VALUE);
        if (date && value && value.isAfter(date)) {
            return Promise.reject('Ngày sinh phải nhỏ hơn ngày hiện tại');
        }
        return Promise.resolve();
    };

    return (
        <div className={styles.loginPage}>
            <OtpModal
                open={openedDetailsModal}
                onCancel={() => handlerDetailsModal.close()}
                idHash={idHash}
                email={email}
            />

            <Flex justify="space-between" align="center" style={{ width: '90vw', margin: '40px 0px' }}>
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
                    <Image
                        src={imgContact}
                        style={{ objectFit: 'cover', borderRadius: 20 }}
                        preview={false}
                        className={styles.image}
                    />
                </div>
                <div className={styles.loginFormRight}>
                    <Title level={3} className={styles.customTitle}>
                        Đăng ký
                    </Title>
                    <Form
                        style={{ padding: '0px 40px' }}
                        form={form}
                        name="signup-form"
                        layout="vertical"
                        onFinish={onFinish}
                    >
                        <div className={styles.inputContainer}>
                            <InputTextField
                                name="userName"
                                label={
                                    <div
                                        style={{
                                            fontSize: 16,
                                            fontWeight: '500',
                                            color: '#fff',
                                        }}
                                    >
                                        {intl.formatMessage(commonMessage.username)}
                                    </div>
                                }
                                placeholder={intl.formatMessage(commonMessage.phoneAndEmail)}
                                size="large"
                            />
                        </div>
                        <div className={styles.inputContainer}>
                            <InputTextField
                                name="fullName"
                                label={
                                    <div
                                        style={{
                                            fontSize: 16,
                                            fontWeight: '500',
                                            color: '#fff',
                                        }}
                                    >
                                        {intl.formatMessage(commonMessage.fullName)}
                                    </div>
                                }
                                placeholder={intl.formatMessage(message.enterYourFullName)}
                                size="large"
                            />
                        </div>
                        <div className={styles.inputContainer}>
                            <InputTextField
                                name="email"
                                label={
                                    <div
                                        style={{
                                            fontSize: 16,
                                            fontWeight: '500',
                                            color: '#fff',
                                        }}
                                    >
                                        {intl.formatMessage(commonMessage.email)}
                                    </div>
                                }
                                placeholder={intl.formatMessage(message.enterYourEmail)}
                                size="large"
                            />
                        </div>
                        <div className={styles.inputContainer}>
                            <InputTextField
                                name="phone"
                                label={
                                    <div
                                        style={{
                                            fontSize: 16,
                                            fontWeight: '500',
                                            color: '#fff',
                                        }}
                                    >
                                        {intl.formatMessage(commonMessage.phone)}
                                    </div>
                                }
                                placeholder={intl.formatMessage(message.enterYourPhone)}
                                size="large"
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
                                form.submit();
                            }}
                        >
                            {intl.formatMessage(commonMessage.signup)}
                        </Button>

                        <div className={styles.bottom}>
                            <div className={styles.noAccount}>Nếu có tài khoản</div>
                            <Link to="/login" className={styles.request}>
                                Đăng nhập
                            </Link>
                        </div>
                    </Form>
                </div>
            </Flex>
        </div>
    );
};

export default SignupPage;
