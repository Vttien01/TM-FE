import React from 'react';
import BasicModal from '@components/common/form/BasicModal';
import styles from './AppHeader.module.scss';
import useTranslate from '@hooks/useTranslate';
import { defineMessages } from 'react-intl';
import RegisterFbForm from './RegisterFbForm';

const message = defineMessages({
    register: 'Đăng ký Facebook',
});
const ModalFbRegister = ({ opened, close, openLogin, dataFacebook }) => {
    const translate = useTranslate();

    return (
        <BasicModal
            size="calc(40vw)"
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
            <RegisterFbForm
                isCloseRegister={close}
                isOpenLogin={openLogin}
                dataFacebook={dataFacebook}

                // isEditing={this.isEditing}
                // dataDetail={this.isEditing ? this.dataDetail : {}}
                // t={t}
                // formRef={this.foodFormRef}
                // handleAddMoreBeilage={this.handleAddMoreBeilage}
            />
        </BasicModal>
    );
};

export default ModalFbRegister;
