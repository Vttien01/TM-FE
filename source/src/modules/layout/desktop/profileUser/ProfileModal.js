import CropImageField from '@components/common/form/CropImageField';
import DatePickerField from '@components/common/form/DatePickerField';
import SelectField from '@components/common/form/SelectField';
import TextField from '@components/common/form/TextField';
import { DATE_FORMAT_DISPLAY, DATE_FORMAT_VALUE, genderValues } from '@constants';
import apiConfig from '@constants/apiConfig';
import useAuth from '@hooks/useAuth';
import useFetch from '@hooks/useFetch';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { showErrorMessage, showSucsessMessage } from '@services/notifyService';
import { Button, Col, Flex, Form, InputNumber, Modal, Row, Table } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';
import { FormattedMessage, defineMessage } from 'react-intl';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const message = defineMessage({
    copyRight: '{brandName} - © Copyright {year}. All Rights Reserved',
    loginFail: 'Chưa điền đủ các trường thông tin!!!',
    login: 'Đăng nhập',
    updateSuccess: 'Cập nhật thành công',
    updateFail: 'Cập nhật thất bại',
});

const ProfileModal = ({ open, onCancel, profile }) => {
    const [ form ] = Form.useForm();
    const navigate = useNavigate();
    const translate = useTranslate();
    const [ imageUrl, setImageUrl ] = useState(null);
    const { execute, loading } = useFetch(apiConfig.user.updateProfile, {
        immediate: false,
    });
    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);
    const uploadFile = (file, onSuccess, onError) => {
        executeUpFile({
            data: {
                type: 'AVATAR',
                file: file,
            },
            onCompleted: (response) => {
                if (response.result === true) {
                    onSuccess();
                    setImageUrl(response.data.filePath);
                }
            },
            onError: (error) => {
                onError();
            },
        });
    };
    const handleProfileModal = () => {
        const data = form.getFieldsValue();
        execute({
            data: { ...data, id: profile?.id, gender: 1 },
            onCompleted: (res) => {
                onCancel();
                showSucsessMessage(translate.formatMessage(message.updateSuccess));
            },
            onErrorr: (err) => {
                onCancel();
                showErrorMessage(translate.formatMessage(message.updateFail));
            },
        });
    };
    useEffect(() => {
        if (profile) {
            // profile.birthday = profile?.account?birthday && dayjs(profile?.account?.birthday, DATE_FORMAT_VALUE);
            form.setFieldsValue({
                ...profile,
                fullName: profile?.account?.fullName,
                email: profile?.account?.email,
                username: profile?.account?.username,
                phone: profile?.account?.phone,
            });
        }
        setImageUrl(profile?.account?.avatar);
    }, [ profile ]);
    return (
        <Modal
            title={<FormattedMessage defaultMessage="Sửa thông tin cá nhân" />}
            open={open}
            onCancel={onCancel}
            // onOk={() => form.submit()}
            width={'50vw'}
            footer={
                <Flex width="100%" justify="flex-end" gap="middle">
                    <Button key="cancel" onClick={onCancel}>
                        Đóng
                    </Button>
                    <Button
                        key="ok"
                        type="primary"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleProfileModal();
                        }}
                    >
                        Cập nhật
                    </Button>
                </Flex>
            }
        >
            <Form form={form}>
                <CropImageField
                    label={translate.formatMessage(commonMessage.avatar)}
                    name="avatarPath"
                    imageUrl={imageUrl}
                    aspect={1 / 1}
                    uploadFile={uploadFile}
                />
                <Row gutter={16}>
                    <Col span={12}>
                        <TextField label={translate.formatMessage(commonMessage.fullName)} name="fullName" required />
                    </Col>
                    <Col span={12}>
                        <TextField label={translate.formatMessage(commonMessage.username)} name="username" required />
                    </Col>
                    {/* <Col span={12}>
                        <DatePickerField
                            label="Ngày sinh"
                            showTime={false}
                            name="birthday"
                            format={DATE_FORMAT_DISPLAY}
                            style={{ width: '100%', height: 45 }}
                            size="small"
                        />
                    </Col> */}
                    <Col span={12}>
                        <TextField label={translate.formatMessage(commonMessage.email)} name="email" />
                    </Col>
                    <Col span={12}>
                        <TextField label={translate.formatMessage(commonMessage.phone)} name="phone" required />
                    </Col>
                    <Col span={12}>
                        <TextField
                            type="password"
                            label={<FormattedMessage defaultMessage="Mật khẩu cũ" />}
                            required
                            name="oldPassword"
                        />
                    </Col>
                    <Col span={12}>
                        <TextField
                            type="password"
                            label={<FormattedMessage defaultMessage="Mật khẩu mới" />}
                            name="password"
                            rules={[
                                {
                                    validator: async () => {
                                        const isTouched = form.isFieldTouched('newPassword');
                                        if (isTouched) {
                                            const value = form.getFieldValue('newPassword');
                                            if (value.length < 6) {
                                                throw new Error(
                                                    translate.formatMessage(commonMessage.validatePassword),
                                                );
                                            }
                                        }
                                    },
                                },
                            ]}
                        />
                    </Col>
                    <Col span={12}>
                        <TextField
                            type="password"
                            label={translate.formatMessage(commonMessage.confirmPassword)}
                            rules={[
                                {
                                    validator: async () => {
                                        const password = form.getFieldValue('newPassword');
                                        const confirmPassword = form.getFieldValue('confirmPassword');
                                        if (password !== confirmPassword) {
                                            throw new Error(translate.formatMessage(commonMessage.passwordNotMatch));
                                        }
                                    },
                                },
                            ]}
                        />
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default ProfileModal;
