import React from 'react';
import styles from './ToolTips.module.scss';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap.css';
const ToolTips = ({ children, place, content, trigger, overlayClassName, ...rest }) => {
    return (
        <Tooltip
            prefixCls="rc-tooltip"
            overlayClassName={overlayClassName}
            trigger={trigger}
            placement={place}
            overlay={content}
            {...rest}
        >
            {children}
        </Tooltip>
    );
};

export default ToolTips;
