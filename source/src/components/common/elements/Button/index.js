import React from 'react';
import { ReactComponent as Loader } from '@assets/icons/loader.svg';
import styles from './index.module.scss';
import classNames from 'classnames';
const Button = ({
    className,
    refControl,
    onSubmit,
    onClick,
    loading = false,
    disabled,
    children,
    style,
    hidden,
    ...props
}) => {
    return (
        <button
            className={classNames(styles.submitBtn, className)}
            onSubmit={onSubmit}
            disabled={disabled}
            style={style}
            onClick={onClick}
            hidden={hidden}
            {...props}
            ref={refControl}
        >
            {!loading ? children : <Loader className={styles.spinner} />}
        </button>
    );
};

export default Button;
