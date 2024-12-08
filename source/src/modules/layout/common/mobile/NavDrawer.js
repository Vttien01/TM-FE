import React from 'react';
import styles from './NavDrawer.module.scss';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import close from '@assets/icons/close.svg';
import { ReactComponent as ArrowLeft } from '@assets/icons/arrowleft.svg';
import Typo from '@components/common/elements/Typo';

const NavDrawer = ({ open, onClose, direction = 'left', children, headerTitle = '' }) => {
    return (
        <Drawer
            open={open}
            style={{ backgroundColor: '#182029' }}
            onClose={onClose}
            direction={direction}
            className={styles.drawer}
        >
            <div className={styles.header}>
                <div className={styles.title}>
                    {/* <ArrowLeft onClick={onClose}/> */}
                    <Typo size="small">{headerTitle}</Typo>
                </div>

                <div className={styles.close}>
                    <img src={close} alt="" onClick={onClose} />
                </div>
            </div>
            {children}
        </Drawer>
    );
};

export default NavDrawer;
