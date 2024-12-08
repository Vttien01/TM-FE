import React from 'react';
import styles from './index.module.scss';
import classNames from 'classnames';
const Container = ({ children, className, styles, ...props }) => {
    return (
        <div className={classNames(className, 'container')} style={styles} {...props}>
            {children}
        </div>
    );
};

export default Container;
