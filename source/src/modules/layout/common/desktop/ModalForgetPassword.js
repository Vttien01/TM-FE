import React from 'react';
import BasicModal from '@components/common/form/BasicModal';
import styles from './AppHeader.module.scss';
import ForgetPasswordForm from '@modules/layout/desktop/landing/Login/ForgetPassword';
import useTranslate from '@hooks/useTranslate';
import { defineMessages } from 'react-intl';

const message = defineMessages({
    forgetPassword: 'Quên mật khẩu',
});
const ModalForgetPassword = ({
    opened,
    close,
    openRegister,
    openLogin,
    openChangeForgetPassword,
    setIdCode,
    idCode,
}) => {
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
            <ForgetPasswordForm
                isCloseForgetPassword={close}
                isOpenLogin={openLogin}
                isOpenRegister={openRegister}
                openChangeForgetPassword={openChangeForgetPassword}
                setIdCode={setIdCode}
                idCode={idCode}
            />
        </BasicModal>
    );
};

export default ModalForgetPassword;
