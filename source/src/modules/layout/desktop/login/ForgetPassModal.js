import { BaseForm } from '@components/common/form/BaseForm';
import InputTextField from '@components/common/form/InputTextField';
import TextField from '@components/common/form/TextField';
import TextOtpField from '@components/common/form/TextOtpField';
import apiConfig from '@constants/apiConfig';
import useFetch from '@hooks/useFetch';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { showErrorMessage, showSucsessMessage } from '@services/notifyService';
import { Button, Card, Col, Form, Input, Modal, Row, Space, Statistic } from 'antd';
import { flatMap } from 'lodash';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, defineMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

const message = defineMessage({
    copyRight: '{brandName} - © Copyright {year}. All Rights Reserved',
    loginFail: 'Chưa điền đủ các trường thông tin!!!',
    otpFail: 'Nhập mã OTP thất bại!!',
    login: 'Đăng nhập',
});

const ForgetPassModal = ({ handleAddList, open, onCancel, data, isEditing, handleEditItemList }) => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const [ idHash, setidHash ] = useState('');
    const [ formOtp ] = Form.useForm();
    const [ imageUrl, setImageUrl ] = useState(null);
    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);
    const { execute: executeRequestForgetPassword, loading: loadingRequestForgetPassword } = useFetch({
        ...apiConfig.account.resquestForgetPassword,
    });
    const { execute: executeForgetPassword, loading: loadingForgetPassword } = useFetch({
        ...apiConfig.account.forgetPassword,
    });

    const handleFinish = (values) => {
        executeForgetPassword({
            data: { newPassword: values.newPassword, otp: values.otp, idHash: idHash },
            onCompleted: (response) => {
                console.log(response);
                showSucsessMessage(response.message);
                setIsCounting(false);
                onCancel();
            },
            onError: (error) => {
                showErrorMessage(error.message);
                setIsCounting(false);
            },
        });
    };
    const [ secondsLeft, setSecondsLeft ] = useState();
    const [ isCounting, setIsCounting ] = useState(false);

    const handleGetOtp = () => {
        // Xử lý sự kiện khi người dùng click vào "Quên mật khẩu?"
        const email = formOtp.getFieldValue('email');
        let data;
        data = { email };
        executeRequestForgetPassword({
            data: { ...data },
            onCompleted: (response) => {
                setidHash(response.data.idHash);
                showSucsessMessage(response.message);
                setSecondsLeft(0);
                setIsCounting(true);
            },
            onError: ({ response }) => {
                showErrorMessage(response.data.message);
                setIsCounting(false);
            },
        });
    };

    useEffect(() => {
        let timer;
        if (isCounting) {
            timer = setInterval(() => {
                setSecondsLeft((prevSeconds) => (prevSeconds > 0 ? prevSeconds - 1 : 0));
            }, 1000);
        }

        return () => {
            clearInterval(timer);
        };
    }, [ isCounting ]);

    const formattedTime = `${Math.floor(secondsLeft / 60)
        .toString()
        .padStart(2, '0')}:${(secondsLeft % 60).toString().padStart(2, '0')}`;

    const [ loadings, setLoadings ] = useState([]);
    const enterLoading = (index) => {
        setLoadings((prevLoadings) => {
            const newLoadings = [ ...prevLoadings ];
            newLoadings[index] = true;
            return newLoadings;
        });
        setTimeout(() => {
            setLoadings((prevLoadings) => {
                const newLoadings = [ ...prevLoadings ];
                newLoadings[index] = false;
                return newLoadings;
            });
        }, 4000);
    };
    return (
        <Modal
            title={idHash == '' ? 'Quên mật khẩu' : 'Đặt lại mật khẩu'}
            open={open}
            onCancel={onCancel}
            footer={null}
        >
            <Card>
                <BaseForm form={formOtp} onFinish={handleFinish} size="100%">
                    {idHash == '' ? (
                        <Row gutter={24}>
                            <Col span={24}>
                                <InputTextField
                                    label={<FormattedMessage defaultMessage="Email" />}
                                    name="email"
                                    type="email"
                                    rules={[
                                        {
                                            type: 'email',
                                            message: 'Định dạng email không hợp lệ',
                                        },
                                    ]}
                                    required
                                />
                            </Col>
                            <Col span={24} style={{ display: 'flex', justifyContent: 'end', gap: 8 }}>
                                {isCounting && secondsLeft > 1 ? (
                                    <Button size="large">
                                        <Statistic
                                            value={formattedTime}
                                            valueStyle={{ fontSize: 15, fontWeight: 500 }}
                                        />
                                        <a
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIsCounting(false);
                                                setSecondsLeft(300);
                                                enterLoading(0);
                                                handleGetOtp();
                                            }}
                                        >
                                            Gửi lại OTP
                                        </a>
                                    </Button>
                                ) : (
                                    <Button
                                        size="large"
                                        loading={loadingRequestForgetPassword}
                                        onClick={(e) => {
                                            enterLoading(0);
                                            e.stopPropagation();
                                            handleGetOtp();
                                        }}
                                    >
                                        {/* {secondsLeft > 0 ? 'Lấy mã' : 'Gửi lại mã'} */}
                                        Lấy mã
                                    </Button>
                                )}
                            </Col>
                        </Row>
                    ) : (
                        <Row gutter={24}>
                            <Col span={24}>
                                <TextField
                                    label={<FormattedMessage defaultMessage="Mật khẩu mới" />}
                                    name="newPassword"
                                    type="password"
                                    rules={[
                                        {
                                            validator: async () => {
                                                const isTouched = formOtp.isFieldTouched('password');
                                                if (isTouched) {
                                                    const value = formOtp.getFieldValue('password');
                                                    if (value.length < 6) {
                                                        throw new Error(
                                                            translate.formatMessage(commonMessage.validatePassword),
                                                        );
                                                    }
                                                }
                                            },
                                        },
                                    ]}
                                    required
                                />
                            </Col>
                            <Col span={24}>
                                <TextField
                                    label={<FormattedMessage defaultMessage="Nhập lại mật khẩu mới" />}
                                    name="confirmPassword"
                                    type="password"
                                    rules={[
                                        {
                                            validator: async () => {
                                                const password = formOtp.getFieldValue('newPassword');
                                                const confirmPassword = formOtp.getFieldValue('confirmPassword');
                                                if (password !== confirmPassword) {
                                                    throw new Error(
                                                        translate.formatMessage(commonMessage.passwordNotMatch),
                                                    );
                                                }
                                            },
                                        },
                                    ]}
                                    // required
                                />
                            </Col>
                            <Col span={24} style={{ textAlign: 'center' }} length={4}>
                                <TextOtpField name="otp" placeholder="OTP" required length={4} />
                            </Col>
                            <Col span={24} style={{ display: 'flex', justifyContent: 'end', gap: 8 }}>
                                <Button
                                    size="large"
                                    // loading={loading}
                                    onClick={() => {
                                        setidHash('');
                                    }}
                                >
                                    Quay lại
                                </Button>
                                <Button
                                    type="primary"
                                    size="large"
                                    // loading={loading}
                                    onClick={() => {
                                        formOtp.submit();
                                    }}
                                >
                                    Xác nhận
                                </Button>
                            </Col>
                        </Row>
                    )}
                </BaseForm>
            </Card>
        </Modal>
    );
};

export default ForgetPassModal;
