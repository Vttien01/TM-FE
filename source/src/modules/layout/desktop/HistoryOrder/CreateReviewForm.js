import { UserOutlined } from '@ant-design/icons';
import AvatarField from '@components/common/form/AvatarField';
import { BaseForm } from '@components/common/form/BaseForm';
import TextField from '@components/common/form/TextField';
import { AppConstants } from '@constants';
import apiConfig from '@constants/apiConfig';
import useAuth from '@hooks/useAuth';
import useFetch from '@hooks/useFetch';
import useNotification from '@hooks/useNotification';
import useTranslate from '@hooks/useTranslate';
import { showErrorMessage, showSucsessMessage } from '@services/notifyService';
import { Button, Col, Form, Modal, Rate, Row } from 'antd';
import React, { useState } from 'react';
import { defineMessages } from 'react-intl';

const messages = defineMessages({
    objectName: 'Thêm đánh giá',
    update: 'Cập nhật',
    create: 'Thêm mới',
    createSuccess: 'Tạo {objectName} thành công',
});
const CreateReviewForm = ({ setActive, orderDetailId, onCancel }) => {
    const translate = useTranslate();
    const [ form ] = Form.useForm();
    const [ star, setStar ] = useState();
    const { profile } = useAuth();
    const { execute: executeCreateReview, loading: loadingCreateReview } = useFetch(apiConfig.review.create, {
        immediate: false,
    });
    const handleCreateReview = (value) => {
        executeCreateReview({
            data: {
                orderDetailId: orderDetailId,
                message: value.message,
                star: star,
            },
            onCompleted: () => {
                showSucsessMessage('Tạo đánh giá thành công');
                form.setFieldValue();
                setActive(1);
            },
            onError: ({ response }) => {
                if (response?.data?.code === 'ERROR-REVIEW-0001') {
                    showErrorMessage('Bạn đã tạo đánh giá cho sản phẩm này!');
                } else {
                    showErrorMessage(response?.data?.message);
                }
                setActive(1);
            },
        });
        onCancel();
    };
    const handleRateChange = (value) => {
        setStar(value);
    };
    return (
        <BaseForm form={form} onFinish={handleCreateReview} size="100%">
            <Row style={{ textAlign: 'center' }}>
                <Col span={24} style={{ margin: '0 auto', textAlign: 'center' }}>
                    <AvatarField
                        size={100}
                        icon={<UserOutlined />}
                        src={profile?.account?.avatar && `${AppConstants.contentRootUrl}${profile?.account?.avatar}`}
                    />
                    <div style={{ fontWeight: '500', fontSize: '18px', margin: '10px 0' }}>
                        {profile?.account?.fullName}
                    </div>
                    <Rate style={{ marginBottom: '30px' }} name="star" onChange={handleRateChange} />
                </Col>
            </Row>

            <Row>
                <Col span={24}>
                    <TextField name="message" type="textarea" style={{ height: 300 }} />
                </Col>
            </Row>
            <Row>
                <Button key="submit" type="primary" htmlType="submit" style={{ width: '100%' }}>
                    {translate.formatMessage(messages.create)}
                </Button>
            </Row>
        </BaseForm>
    );
};

export default CreateReviewForm;
