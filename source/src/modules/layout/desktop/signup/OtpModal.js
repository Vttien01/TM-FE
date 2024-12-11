import { BaseForm } from '@components/common/form/BaseForm';
import TextField from '@components/common/form/TextField';
import TextOtpField from '@components/common/form/TextOtpField';
import { storageKeys } from '@constants';
import apiConfig from '@constants/apiConfig';
import { statusOptions } from '@constants/masterData';
import useFetch from '@hooks/useFetch';
import useFetchAction from '@hooks/useFetchAction';
import useTranslate from '@hooks/useTranslate';
import { showErrorMessage } from '@services/notifyService';
import { setCacheAccessToken } from '@services/userService';
import { accountActions } from '@store/actions';
import { setData } from '@utils/localStorage';
import { Alert, Button, Card, Col, Form, Input, Modal, Row, Statistic } from 'antd';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, defineMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

const message = defineMessage({
    copyRight: '{brandName} - © Copyright {year}. All Rights Reserved',
    loginFail: 'Chưa điền đủ các trường thông tin!!!',
    login: 'Đăng nhập',
});

const OtpModal = ({ open, onCancel, data, idHash, email }) => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const [ formOtp ] = Form.useForm();
    const { execute, loading } = useFetch({
        ...apiConfig.user.confirmOtp,
    });
    const { execute: executeRequestSendMail, loading: loadingRequestSendMail } = useFetch({
        ...apiConfig.user.requestSendMail,
    });

    const handleFinish = (values) => {
        execute({
            data: { otp: values.otp, idHash: idHash },
            onCompleted: (res) => {
                setSecondsLeft(300);
                setIsCounting(false);
                formOtp.resetFields();
                navigate('/login');
                onCancel();
            },
            onError: (error) => {
                if (error.code === 'ERROR-ACCOUNT-0005' || error.code === 'ERROR-ACCOUNT-0006')
                    showErrorMessage('Vui lòng nhập mã khác!');
                setSecondsLeft(300);
                setIsCounting(false);
                formOtp.resetFields();
            },
        });
    };

    const [ secondsLeft, setSecondsLeft ] = useState();
    const [ isCounting, setIsCounting ] = useState(false);

    const handleGetOtp = () => {
        executeRequestSendMail({
            data: { email },
            onCompleted: (response) => {
                <Alert message="OTP đã được gửi" description="Vui lòng kiểm tra email." type="success" showIcon />;
                setSecondsLeft(300);
                setIsCounting(true);
            },
            onError: (error) => {
                showErrorMessage(error.message);
                setSecondsLeft(300);
                setIsCounting(false);
            },
        });
        formOtp.resetFields();
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
        // console.log(isCounting);
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
            title={<FormattedMessage defaultMessage="Vui lòng kiểm tra email và nhập OTP" />}
            open={open}
            onCancel={onCancel}
            footer={null}
            width={450}
        >
            <Card>
                <BaseForm form={formOtp} onFinish={handleFinish} size="100%">
                    <Row gutter={24}>
                        <Col span={24} style={{ textAlign: 'center' }}>
                            <TextOtpField name="otp" required length={4} size={'large'} />
                        </Col>
                        <Col span={24} style={{ display: 'flex', justifyContent: 'end', gap: 8 }}>
                            {isCounting && secondsLeft > 1 ? (
                                <Button size="large">
                                    <Statistic value={formattedTime} valueStyle={{ fontSize: 15, fontWeight: 500 }} />
                                    <a
                                        style={{ fontSize: 16 }}
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
                                    loading={loadings[0]}
                                    onClick={(e) => {
                                        enterLoading(0);
                                        e.stopPropagation();
                                        handleGetOtp();
                                    }}
                                >
                                    Lấy mã
                                </Button>
                            )}
                            <Button
                                type="primary"
                                size="large"
                                loading={loading}
                                onClick={() => {
                                    formOtp.submit();
                                }}
                            >
                                Xác nhận
                            </Button>
                        </Col>
                    </Row>
                </BaseForm>
            </Card>
        </Modal>
    );
};

export default OtpModal;
