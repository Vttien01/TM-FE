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
import { Link as LinkScroll } from 'react-scroll';

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
const footer = [ { title: 'Đăng ký làm giảng viên', to: 'expert' } ];
const AppFooter = () => {
    const intl = useIntl();

    return (
        <div className={styles.appFooter}>
            <div className="container" style={{ display: 'flex' }}>
                <div className={styles.content}>
                    <div className={styles.info}>
                        <div className={styles.image}>{/* <img src={logoFooter} alt="logoFooter" /> */}</div>
                        <div className={styles.detail}>
                            <Typo
                                size="primary"
                                type="bold"
                                style={{ color: 'var(--text-color-light)', marginBottom: '22px' }}
                            >
                                {intl.formatMessage(message.info)}
                            </Typo>
                            <div className={styles.address}>
                                <img src={locate} alt="locate" />
                                <Typo size="sub" style={{ color: 'var(--text-color-light)' }}>
                                Gò Vấp, tp Hồ Chí Minh
                                </Typo>
                            </div>
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
                    </div>
                    <div className={styles.about}>
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
                    </div>
                    <div className={styles.cooperation}>
                        <Typo
                            size="primary"
                            className={styles.title}
                            type="bold"
                            style={{ color: 'var(--text-color-light)' }}
                        >
                            {intl.formatMessage(message.cooperation)}{' '}
                        </Typo>
                        <ul className={styles.listAbout}>
                            <li className={styles.itemAbout}>
                                <Link to={'#'}>
                                    <Typo size="sub" style={{ color: 'var(--text-color-light)' }}>
                                        {intl.formatMessage(message.sitemap)}
                                    </Typo>
                                </Link>
                            </li>
                            <li className={styles.itemAbout}>
                                <Link to={'#'}>
                                    <Typo size="sub" style={{ color: 'var(--text-color-light)' }}>
                                        {intl.formatMessage(message.corporateTraining)}{' '}
                                    </Typo>
                                </Link>
                            </li>
                            <li className={styles.itemAbout}>
                                <Link to={'#'}>
                                    <Typo size="sub" style={{ color: 'var(--text-color-light)' }}>
                                        {intl.formatMessage(message.downloadApp)}
                                    </Typo>
                                </Link>
                            </li>
                            <li className={styles.itemAbout}>
                                <Link to={'#'}>
                                    <Typo size="sub" style={{ color: 'var(--text-color-light)' }}>
                                        {intl.formatMessage(message.accessibilityStatement)}
                                    </Typo>
                                </Link>
                            </li>
                            {/* <li className={styles.itemAbout}>
                            <Link to={'#'}>
                                <Typo size="sub" style={{ color: 'var(--text-color-light)' }}>
                                    {intl.formatMessage(message.registerLecturer)}
                                </Typo>
                            </Link>
                        </li> */}
                            {footer.map((item, index) => (
                                <li key={index} className={location.pathname === item.to && styles.active}>
                                    <LinkScroll
                                        to={item.to}
                                        activeClass="active"
                                        offset={-900}
                                        spy={true}
                                        smooth={true}
                                        duration={500}
                                    >
                                        {item.title}
                                    </LinkScroll>
                                </li>
                            ))}
                            <li className={styles.itemAbout}>
                                <Link to={'#'}>
                                    <Typo size="sub" style={{ color: 'var(--text-color-light)' }}>
                                        {intl.formatMessage(message.inHouseTraining)}
                                    </Typo>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className={styles.copyright}>
                        {/* <button className={styles.btn}>
                        <img src={language} alt="language" />
                        <Typo size="tiny" style={{ color: 'var(--text-color-light)', fontSize: '11px' }}>
                            {intl.formatMessage(message.vietnamese)}
                        </Typo>
                    </button> */}
                        <Typo size="sub" className={styles.text} style={{ color: 'var(--text-color-light)' }}>
                        @2023 Life, lnc.
                        </Typo>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppFooter;
