import useTranslate from '@hooks/useTranslate';
import React from 'react';
import './contact.css';
import { Button, Card, Col, Flex, Image, Row, Space } from 'antd';
import { BaseForm } from '@components/common/form/BaseForm';
import { FormattedMessage } from 'react-intl';
import TextField from '@components/common/form/TextField';
import { commonMessage } from '@locales/intl';
import imgContact from '@assets/images/imgContact.png';
import imgContact1 from '@assets/images/background.png';

const ContactHome = () => {
    const translate = useTranslate();
    return (
        <div>
            {/* <Image
                src={imgContact}
                style={{ objectFit: 'cover',height: '100vh', width: '100vw' }}
                preview={false}
            /> */}
            <Flex
                align="center"
                justify="center"
                style={{
                    height: '100vh',
                    backgroundImage: `url(${imgContact1})`, // Correctly use backgroundImage
                    backgroundSize: 'cover', // Ensures the image covers the container
                    backgroundPosition: 'center', // Centers the background image
                    backgroundRepeat: 'no-repeat',
                }}
                gap={16}
            >
                <div className="areaContact1">
                    <Image
                        src={imgContact}
                        style={{ objectFit: 'cover', height: 600, width: 600, borderRadius: 12 }}
                        preview={false}
                    />
                </div>
                <div className="areaContact2">
                    <BaseForm style={{ width: 500 }}>
                        <Card
                            title="LIÊN HỆ VỚI CHÚNG TÔI"
                            headStyle={{ fontSize: 25, marginLeft: 80 }}
                            hoverable={true}
                            style={{}}
                        >
                            <Row gutter={16}>
                                <Col span={24}>
                                    <TextField
                                        label={<FormattedMessage defaultMessage="Tên của bạn" />}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Yêu cầu',
                                            },
                                        ]}
                                        name="Name"
                                    />
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={24}>
                                    <TextField
                                        label={translate.formatMessage(commonMessage.email)}
                                        type="email"
                                        name="email"
                                    />
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={24}>
                                    <TextField
                                        label={<FormattedMessage defaultMessage="Tiêu đề" />}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Yêu cầu',
                                            },
                                        ]}
                                        name="address"
                                    />
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={24}>
                                    <TextField
                                        label={<FormattedMessage defaultMessage="Nội dung" />}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Yêu cầu',
                                            },
                                        ]}
                                        type="textarea"
                                        name="content"
                                    />
                                </Col>
                            </Row>
                            <Button
                                type="primary"
                                size="large"
                                // loading={loading || loginLoading}
                                htmlType="submit"
                                style={{ width: '100%' }}
                            >
                                {<FormattedMessage defaultMessage="Gửi liên hệ" />}
                            </Button>

                            <div className="footer-card-form"></div>
                        </Card>
                    </BaseForm>
                </div>
            </Flex>
        </div>
    );
};

export default ContactHome;
