import React from 'react';
import styles from './Dashboard.module.scss';
import classNames from 'classnames';
import Typo from '../Typo';
import useTranslate from '@hooks/useTranslate';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as Close } from '@assets/icons/close.svg';

const Dashboard = ({ children, className,title }) => {
    const translate = useTranslate();
    const navigate = useNavigate();

    return (
        <div className={classNames(className, styles.Dashboard)} >
            <div style={{ display: 'flex' }} className={styles.titleProfile}>
                <div style={{ display: 'flex', justifyContent:'center' }} >
                    <Typo size="small" type="bold" style={{ color: 'var(--text-color)' }}>
                        {title}
                    </Typo>
                    <div className={styles.iconClose}>

                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'end', width:'90%', marginTop:'-28px' }} >
                    <i
                        className={styles.iconClose}
                        onClick={(e) => {
                            e.stopPropagation();
                            // navigate(generatePath(routes.profilePage.path), {
                            //     state: { action: 'home', prevPath: location.pathname },
                            // });
                            navigate('/');
                        }}
                    >
                        <Close />
                    </i>
                </div>
            </div>
            {children}
        </div>
    );
};

export default Dashboard;
