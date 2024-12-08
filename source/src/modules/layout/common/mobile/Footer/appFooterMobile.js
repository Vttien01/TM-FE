import classNames from 'classnames';
import React from 'react';
import logoFooter from '@assets/images/icon_logo.png';
import styles from './AppFooter.module.scss';
import phone from '@assets/icons/phone.svg';
import mail from '@assets/icons/mail.svg';
import locate from '@assets/icons/locate.svg';
import language from '@assets/icons/language.svg';

import { Link } from 'react-router-dom';
import { defineMessages, useIntl } from 'react-intl';
import Healing from '@components/common/elements/Healing';
import Typo from '@components/common/elements/Typo';
import { Col, Flex, Row, Space } from 'antd';

const message = defineMessages({
    objectName: 'Loại',
    info: 'Thông tin',
    abountLifeUni: 'Về LifeUni',
    rules: 'Điều khoản',
    privacyPolicy: 'Chính sách về quyền riêng tư',
    cookieSettings: 'Cài đặt cookie',
    cooperation: 'Hợp tác liên kết',
    blog: 'Blog',
    introduce: 'Giới thiệu',
    contactUs: 'Hãy liên hệ với chúng tôi',
    sitemap: 'Sơ đồ trang web',
    corporateTraining: 'Đào tạo doanh nghiệp',
    downloadApp: 'Tải ứng dụng',
    accessibilityStatement: 'Tuyên bố về khả năng tiếp cận',
    registerLecturer: 'Đăng ký làm giảng viên',
    inHouseTraining: 'Đào tạo Inhouse',
    vietnamese: 'Tiếng Việt',
});
const AppFooterMobile = () => {
    const intl = useIntl();

    return (
        <div className={styles.appFooter}>
            <div className="container" style={{ width: '100%' }}>
                <div className={styles.footerMobile}>
                    <Row gutter={16} className={styles.info}>
                        <Col span={12} className={styles.about}>
                            <Typo
                                size="primary"
                                className={styles.title}
                                type="bold"
                                style={{ color: 'var(--text-color-light)' }}
                            >
                                {intl.formatMessage(message.abountLifeUni)}
                            </Typo>

                            <ul className={styles.listAbout}>
                                <li className={styles.itemAbout}>
                                    <Link to={'#'}>{intl.formatMessage(message.rules)}</Link>
                                </li>
                                <li className={styles.itemAbout}>
                                    <Link to={'#'}>{intl.formatMessage(message.privacyPolicy)}</Link>
                                </li>
                                <li className={styles.itemAbout}>
                                    <Link to={'#'}>{intl.formatMessage(message.cookieSettings)}</Link>
                                </li>
                                <li className={styles.itemAbout}>
                                    <Link to={'#'}>{intl.formatMessage(message.blog)}</Link>
                                </li>
                                <li className={styles.itemAbout}>
                                    <Link to={'#'}>{intl.formatMessage(message.introduce)}</Link>
                                </li>
                                <li className={styles.itemAbout}>
                                    <Link to={'#'}>{intl.formatMessage(message.contactUs)}</Link>
                                </li>
                            </ul>
                        </Col>
                        <Col span={12} className={styles.about}>
                            <Typo
                                size="primary"
                                className={styles.title}
                                type="bold"
                                style={{ color: 'var(--text-color-light)' }}
                            >
                                {intl.formatMessage(message.cooperation)}
                            </Typo>

                            <ul className={styles.listAbout}>
                                <li className={styles.itemAbout}>
                                    <Link to={'#'}>{intl.formatMessage(message.sitemap)}</Link>
                                </li>
                                <li className={styles.itemAbout}>
                                    <Link to={'#'}>{intl.formatMessage(message.corporateTraining)}</Link>
                                </li>
                                <li className={styles.itemAbout}>
                                    <Link to={'#'}>{intl.formatMessage(message.downloadApp)}</Link>
                                </li>
                                <li className={styles.itemAbout}>
                                    <Link to={'#'}>{intl.formatMessage(message.accessibilityStatement)}</Link>
                                </li>
                                <li className={styles.itemAbout}>
                                    <Link to={'#'}>{intl.formatMessage(message.registerLecturer)}</Link>
                                </li>
                                <li className={styles.itemAbout}>
                                    <Link to={'#'}>{intl.formatMessage(message.inHouseTraining)}</Link>
                                </li>
                            </ul>
                        </Col>
                        <Col span={24} className={styles.about}>
                            <Typo
                                size="primary"
                                type="bold"
                                style={{
                                    color: 'var(--text-color-light)',
                                    marginBottom: '12px',
                                    width: '100%',
                                    marginTop: '16px',
                                }}
                            >
                                {intl.formatMessage(message.info)}
                            </Typo>
                            <Flex gap={8} className={styles.address} align="center">
                                <img src={locate} alt="locate" />
                                <Typo size="tiny" style={{ color: 'var(--text-color-light)' }}>
                                    17 Nguyễn Văn Nghi, Q.Gò Vấp, TP.Hồ Chí Minh
                                </Typo>
                            </Flex>
                            <div className={styles.contact}>
                                <div className={styles.phone}>
                                    <img src={phone} alt="phone" />
                                    <Typo size="sub" style={{ color: 'var(--text-color-light)' }}>
                                        012345689
                                    </Typo>
                                </div>
                                <div className={styles.mail}>
                                    <img src={mail} alt="mail" />
                                    <Typo size="sub" style={{ color: 'var(--text-color-light)' }}>
                                        www.lifeuni@gmail.com
                                    </Typo>
                                </div>
                            </div>
                        </Col>

                        <div className={styles.copyright}>
                            <Typo size="tiny" className={styles.text} style={{ color: 'var(--text-color-light)' }}>
                                @2023 Life, lnc.
                            </Typo>
                        </div>
                    </Row>
                </div>
            </div>
        </div>
    );
};

export default AppFooterMobile;
