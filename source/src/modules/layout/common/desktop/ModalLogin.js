import React, { useState } from 'react';
import BasicModal from '@components/common/form/BasicModal';
import styles from './AppHeader.module.scss';
import ModalLoginForm from '@modules/layout/desktop/landing/Login';
import { defineMessages } from 'react-intl';
import useTranslate from '@hooks/useTranslate';

const message = defineMessages({
    login: 'Đăng nhập',
});
const ModalLogin = ({ opened, close, openRegister, openForgetPassword, login, loginFaceBookFunc }) => {
    const translate = useTranslate();
    return (
        <BasicModal
            size="31.25rem"
            isOpen={opened}
            onCloseModal={close}
            footer={false}
            title={translate.formatMessage(message.login)}
            style={{ position: 'relative', width: '50vw', height: '50vh' }}
            classNames={{
                root: styles.modalLoginRoot,
                inner: styles.inner,
                header: styles.header,
                title: styles.title,
                content: styles.content,
                body: styles.body,
            }}
        >
            <ModalLoginForm
                isOpenRegister={openRegister}
                isCloseLogin={close}
                isOpenForgetPassword={openForgetPassword}
                login={login}
                loginFaceBook={loginFaceBookFunc}
            />
        </BasicModal>
    );
};

export default ModalLogin;
