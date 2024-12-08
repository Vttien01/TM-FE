import React from 'react';
import { useState } from 'react';
import styles from './Modal.module.scss';
// import close from '@assets/icons/close.png';

const BasicModal = (props) => {
    const {
        top,
        children,
        afterOpenModal,
        title,
        onCloseModal,
        style,
        isOpen,
        onOkModal,
        onCancelModal,
        size,
        footer,
        classNames,
        fullScreen,
    } = props;
    return (
        <div className={styles.modalContent}>{children}</div>
    );
};

export default BasicModal;
