import styles from './ConfirmModal.module.scss';
import close from '@assets/icons/close.png';

import ReactModal from 'react-modal';
import React from 'react';

function ConfirmModal({
    top,
    width,
    children,
    afterOpenModal,
    title,
    onCloseModal,
    style,
    isOpen,
    onOkModal,
    onCancelModal,
}) {
    const setting = {
        content: {
            top: top || '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: width || '500px',
            // maxHeight:'80vh',
        },
    };

    return (
        <ReactModal
            isOpen={isOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={onCloseModal}
            style={setting}
            contentLabel={title}
            setting={style || setting}
            className={styles.basicModal}
            overlayClassName={styles.overlay}
        >
            <div className={styles.modalHeader}>
                <div>{title}</div>
                <button onClick={onCloseModal}>
                    <img src={close} alt="close-icon" />
                </button>
            </div>
            <div className={styles.modalContent}>{children}</div>
            <div className={styles.modalFooter}>
                <button className={styles.cancelButton} onClick={onCloseModal}>
                    Cancel
                </button>
                <button className={styles.okButton} onClick={onOkModal}>
                    OK
                </button>
            </div>
        </ReactModal>
    );
}

export default ConfirmModal;
