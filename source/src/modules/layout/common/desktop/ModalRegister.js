import React from 'react';
import BasicModal from '@components/common/form/BasicModal';
import styles from './AppHeader.module.scss';
import ModalLoginForm from '@modules/layout/desktop/landing/Login';
import ModalRegisterForm from '@modules/layout/desktop/landing/Login/Register';
import useTranslate from '@hooks/useTranslate';
import { defineMessages } from 'react-intl';

const message = defineMessages({
    register: 'Đăng ký',
});
const ModalRegister = ({ opened, close, openLogin }) => {
    const translate = useTranslate();
    return (
        <BasicModal
            size="37.5rem"
            isOpen={opened}
            onCloseModal={close}
            footer={false}
            title={translate.formatMessage(message.register)}
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
            <ModalRegisterForm
                isCloseRegister={close}
                isOpenLogin={openLogin}
                // isEditing={this.isEditing}
                // dataDetail={this.isEditing ? this.dataDetail : {}}
                // t={t}
                // formRef={this.foodFormRef}
                // handleAddMoreBeilage={this.handleAddMoreBeilage}
            />
        </BasicModal>
    );
};

export default ModalRegister;
