import React from 'react';
import BasicModal from '@components/common/form/BasicModal';
import styles from './AppHeader.module.scss';
import ForgetPasswordForm from '@modules/layout/desktop/landing/Login/ForgetPassword';
import useTranslate from '@hooks/useTranslate';
import { defineMessages } from 'react-intl';
import ChangePasswordForgetPasswordForm from '@modules/layout/desktop/landing/Login/ForgetPassword/ChangePasswordForgetPasswordForm ';

const message = defineMessages({
    forgetPassword: 'Tạo mật khẩu mới',
});
const ModalChangePasswordForgetPassword = ({ opened, close, openRegister, openLogin, idCode }) => {
    const translate = useTranslate();

    return (
        <BasicModal
            size="31.25rem"
            isOpen={opened}
            onCloseModal={close}
            footer={false}
            title={translate.formatMessage(message.forgetPassword)}
            style={{ position: 'relative' }}
            classNames={{
                root: styles.modalLoginRoot,
                inner: styles.inner,
                header: styles.header,
                title: styles.title,
                content: styles.content,
                body: styles.body,
            }}
        >
            <ChangePasswordForgetPasswordForm idCode={idCode} close={close} openLogin={openLogin} />
        </BasicModal>
    );
};

export default ModalChangePasswordForgetPassword;
