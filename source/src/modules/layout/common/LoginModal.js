import styles from './Modal.module.scss';

import React from 'react';
import ReactModal from 'react-modal';
import close from '@assets/icons/close.svg';
import classNames from 'classnames';
function LoginModal({ isOpen, header, onAccept, onCancel, children, form, width = '500px', height, className }) {
    const setting = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: width,
            height: height,
        },
    };

    return (
        <ReactModal
            isOpen={isOpen}
            style={setting}
            // contentLabel={header}
            setting={setting}
            className={classNames(styles.basicModal, className)}
            overlayClassName={styles.overlay}
            preventScroll={true}
            shouldCloseOnOverlayClick={true}
        >
            <div className={styles.actionHeader}>
                <img src={close} onClick={onCancel} />
            </div>
            {header && (
                <div className={styles.modalHeader}>
                    <div></div> <div className={styles.title}> {header}</div> <div></div>
                </div>
            )}
            {children && <div className={styles.modalContent}>{children}</div>}
            {/* <div className={styles.modalFooter}>
                <button type="submit" form={form} className={styles.okButton} onClick={() => onAccept()}>
                    Accept
                </button>
            </div> */}
        </ReactModal>
    );
}

export default LoginModal;
