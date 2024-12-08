import apiConfig from '@constants/apiConfig';
import useFetch from '@hooks/useFetch';
import useFetchAction from '@hooks/useFetchAction';
import { setCacheAccessToken } from '@services/userService';
import { accountActions, appActions } from '@store/actions';
import React, { useEffect } from 'react';
import styles from './index.module.scss';

import { ReactComponent as Close } from '@assets/icons/close.svg';
import Typo from '@components/common/elements/Typo';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import { defineMessages, useIntl } from 'react-intl';
import { generatePath, useNavigate } from 'react-router-dom';
import iconGoogle from '@assets/icons/brandGoogle.svg';
import { GROUP_KIND_EXPERT, GROUP_KIND_SELLER, GROUP_KIND_STUDENT, appAccount, storageKeys } from '@constants';

import { Buffer } from 'buffer';
import { showErrorMessage, showSucsessMessage } from '@services/notifyService';
import { getData, setData } from '@utils/localStorage';
import { useState } from 'react';
import { actions } from '@store/actions/app';
import { useDispatch, useSelector } from 'react-redux';
import { useGoogleLogin } from '@react-oauth/google';
import FacebookLogin from '@greatsumini/react-facebook-login';
import iconFacebook from '@assets/icons/brandFacebook.svg';
import useLoginGG from '@hooks/useLoginGG';
import useLoginFB from '@hooks/useLoginFB';
import { removeItem } from '@utils/localStorage';
import RegisterMobileComponent from '@modules/layout/mobile/login/Register';
import useDisclosure from '@hooks/useDisclosure';
import { commonMessage, commonValidation } from '@constants/intl';
import useAuth from '@hooks/useAuth';
import { checkPassword, checkUserName, validateEmailPhoneInput, validatePasswordInput } from '@utils';
import { Button, Flex, Form, Space } from 'antd';
import { useForm } from 'antd/es/form/Form';
import InputTextField from '@components/common/form/InputTextField';
const message = defineMessages({
    login: 'Đăng nhập',
    phone: 'Số điện thoại / Email',
    emailAddress: 'Địa chỉ email',
    password: 'Mật khẩu',
    enterPassword: 'Nhập mật khẩu',
    showPassword: 'Hiện mật khẩu',
    forgetPassword: 'Quên mật khẩu',
    enterPhone: 'Nhập Số điện thoại / Email',
    otherLogin: 'Hoặc đăng nhập với',
    register: 'Đăng ký',
    loginSuccess: 'Đăng nhập thành công',
    loginFail: 'Số điện thoại hoặc mật khẩu không chính xác',
    userName: 'User name',
    phoneAndEmail: 'Nhập username của bạn',
});
const LoginMobileComponent = () => {
    const translate = useTranslate();
    const intl = useIntl();
    const [ openedError, { open: openError, close: closeError } ] = useDisclosure(false);
    const dispatch = useDispatch();
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
    const navigate = useNavigate();
    const [ ggData, setGGData ] = useState({});
    const queryParameters = new URLSearchParams(window.location.search);
    const isRegisterSuccess = queryParameters.get('isRegisterSuccess');
    const isFreeCourse = queryParameters.get('freeCourse');
    const isBuyDirect = queryParameters.get('buyCourseDirect');
    const freeCourse = useSelector((state) => state.app.freeCourse);
    const buyCourseDirect = useSelector((state) => state.app.buyCourseDirect);
    const sellCode = getData(storageKeys.REF_CODE);
    const { execute: buyFreeCourse, data: buyFreeCourseData } = useFetch(apiConfig.booking.buyFreeCourse);
    const [ form ] = Form.useForm();
    const onFinish = (values) => {
        dispatch(actions.showAppLoading());
        execute({
            data: { ...values, grant_type: 'password' },
            onCompleted: (res) => {
                handleLoginSuccess(res);
                dispatch(actions.hideAppLoading());
            },
            onError: (res) => {
                if (res.access_token) {
                    // if (res.user_kind === GROUP_KIND_STUDENT && res.is_seller) {
                    //     setCacheAccessToken(res.access_token);
                    //     executeGetSellerProfile();
                    //     setData(storageKeys.USER_KIND, GROUP_KIND_SELLER);
                    //     closeError();
                    // } else if (res.user_kind === GROUP_KIND_STUDENT) {
                    //     setCacheAccessToken(res.access_token);
                    //     executeGetProfile();
                    //     setData(storageKeys.USER_KIND, GROUP_KIND_STUDENT);
                    //     closeError();
                    // } else {
                    //     openError();
                    // }

                    dispatch(actions.hideAppLoading());

                    dispatch(actions.hideAppLoading());
                    removeItem(storageKeys.REF_CODE);
                } else {
                    dispatch(actions.hideAppLoading());
                    openError();
                }
            },
        });
    };

    const handleLoginSuccess = (res) => {
        setCacheAccessToken(res.access_token);
        setData(storageKeys.USER_KIND, res.user_kind);
        executeGetProfile();
    };

    const { executeFBRegister, loading: loadingFb } = useLoginFB({});
    const [ isRegisterModalOpen, setIsRegisterModalOpen ] = useState(false);
    const { executeGGRegister, loading: loadinggg, data } = useLoginGG({ setIsRegisterModalOpen });

    const [ openedRegsiter, { open: openRegsiter, close: closeRegsiter } ] = useDisclosure(false);
    const handleOpenRegster = () => {
        openRegsiter();
        setOpen(false);
    };
    const [ open, setOpen ] = useState(false);

    return (
        <section>
            <Flex vertical style={{ padding: '16px' }}>
                <div className={styles?.headerLogin}>
                    <Typo size="big" type="bold" style={{ color: 'var(--title-color)' }} className={styles?.titleLogin}>
                        {translate.formatMessage(message.login)}
                    </Typo>
                    <i
                        className={styles.iconClose}
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(generatePath(routes.homePage.path), {
                                state: { action: 'home', prevPath: location.pathname },
                            });
                            buyCourseDirect && dispatch(appActions.setBuyCourseDirect(false));
                            dispatch(appActions.setPayment(false));
                        }}
                    >
                        <Close />
                    </i>
                </div>
                {/* {isRegisterSuccess && (
                    <Alert variant="light" color="green" title="Thông báo" mt={10}>
                        <Text>{translate.formatMessage(commonMessage.registerSuccess)}</Text>
                    </Alert>
                )}

                {openedError && (
                    <Alert mt={'24'} variant="light" color="red" title="Thông báo">
                        <Text>{translate.formatMessage(commonValidation.passwordValidation)}</Text>
                    </Alert>
                )} */}

                <Form form={form} name="login-form" onFinish={onFinish} layout="vertical">
                    <InputTextField
                        name="username"
                        className={styles.customInput}
                        label={
                            <div
                                style={{
                                    fontSize: 16,
                                    fontWeight: '500',
                                    marginTop: 25,
                                    marginLeft: 0,
                                }}
                            >
                                {intl.formatMessage(message.userName)}
                            </div>
                        }
                        placeholder={intl.formatMessage(message.phoneAndEmail)}
                        size="large"
                        rules={[
                            {
                                validator: checkUserName,
                            },
                        ]}
                    />
                    <InputTextField
                        name="password"
                        classNames={{
                            input: styles.input,
                        }}
                        label={
                            <div
                                style={{
                                    fontSize: 16,
                                    fontWeight: '500',
                                    marginBottom: 5,
                                }}
                            >
                                {intl.formatMessage(message.password)}
                            </div>
                        }
                        placeholder={intl.formatMessage(message.enterPassword)}
                        size="large"
                        type="password"
                        rules={[
                            {
                                validator: checkPassword,
                            },
                        ]}
                    />
                    {/* <Checkbox mt={'15'} label={translate.formatMessage(message.showPassword)} /> */}
                    <Space>
                        <Button
                            type="primary"
                            size="large"
                            htmlType="submit"
                            loading={loading}
                            style={{
                                width: '92vw',
                                height: '58px',
                                fontWeight: '520',
                                background: '#389cfb',
                                margin: '5px 0px 18px 0px',
                                borderRadius: '12px',
                            }}
                            // classNames={{ root: styles.btnLogin, label: styles.label }}
                        >
                            {translate.formatMessage(message.login)}
                        </Button>
                    </Space>
                </Form>
                <Flex mt={'16'} justify="space-between">
                    <div
                        className={styles.forgetPassword}
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(generatePath(routes.forgetPasswordPage.path), {
                                state: { action: 'forgetPassword', prevPath: location.pathname },
                            });
                        }}
                    >
                        {translate.formatMessage(message.forgetPassword)}
                    </div>
                    <div className={styles.btnRegister} onClick={() => handleOpenRegster()}>
                        {translate.formatMessage(message.register)}
                    </div>
                </Flex>
                <div className={styles.otherLogin}>
                    <span>{translate.formatMessage(message.otherLogin)}</span>
                </div>
                <Flex mt="15" justify="center" classNames={{ root: styles.groupBrand }}>
                    <Button
                        // onClick={() => executeGGRegister()}
                        radius="lg"
                        style={{
                            background: '#DC2626',
                            height: '48px',
                            width: '120px',
                            borderRadius: '20px',
                            color: '#fff',
                        }}
                        icon={<img style={{ width: '16px' }} src={iconGoogle} />}
                    >
                        Google
                    </Button>

                    {/* <FacebookLogin
                        appId="310027460208063"
                        onSuccess={(response) => {
                            executeFBRegister(response);
                        }}
                        render={({ onClick, logout }) => (
                            <Button
                                onClick={onClick}
                                onLogoutClick={logout}
                                color={'#1778F2'}
                                radius="lg"
                                leftSection={<img style={{ width: '16px', height: '20px' }} src={iconFacebook} />}
                            >
                                FaceBook
                            </Button>
                        )}
                    /> */}
                </Flex>
                {/* <Modal
                opened={openedRegsiter}
                onClose={() => {
                    closeRegsiter();
                    setQueryParams({});
                }}
                withCloseButton={false}
                fullScreen
                radius={0}
                transitionProps={{ transition: 'fade', duration: 200 }}
                zIndex={300}
                styles={{
                    title: {
                        fontSize: 'var(--h1-font-size)',
                        fontWeight: 'var(--font-bold)',
                        color: 'var(--title-color)',
                        marginLeft: '130px',
                    },
                    header: {
                        paddingTop: '20px',
                        paddingBottom: 0,
                        paddingRight: '15px',
                    },
                    body: {
                        paddingLeft: 0,
                        paddingRight: 0,
                    },
                }}
            >
                <RegisterMobileComponent closeRegsiter={closeRegsiter} />
            </Modal>
            <ModalGgRegister opened={isRegisterModalOpen} data={data} setGGData={setGGData} /> */}
            </Flex>
        </section>
    );
};

export default LoginMobileComponent;
