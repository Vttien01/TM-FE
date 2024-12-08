import React from 'react';
import BasicModal from '@components/common/form/BasicModal';
import styles from './AppHeader.module.scss';

const ModalProfile = ({ opened, close }) => {
    return (
        <BasicModal
            size={700}
            isOpen={opened}
            onCloseModal={close}
            footer={false}
            style={{ position: 'relative' }}
            classNames={{
                root: styles.modalProfileRoot,
                inner: styles.inner,
                header: styles.header,
                title: styles.title,
                content: styles.content,
                body: styles.body,
            }}
        >
            Trang chủ 123445
        </BasicModal>
    );
};

export default ModalProfile;
