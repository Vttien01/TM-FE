import React, { useEffect, useState } from 'react';
import styles from './AppBody.module.scss';
import useDevices from '@hooks/useDevices';
const AppBody = ({ children, width,className }) => {
    return (
        <div style={{ minWidth: width }} className={className}>
            {children}
        </div>
    );
};

export default AppBody;
