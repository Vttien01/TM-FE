import { ReactComponent as Notification } from '@assets/icons/notification.svg';

import { ReactComponent as Dotblue } from '@assets/icons/dotBlue.svg';
import { ReactComponent as Empty } from '@assets/icons/nodata.svg';
import Typo from '@components/common/elements/Typo';
import { notificationKind, storageKeys } from '@constants';
import apiConfig from '@constants/apiConfig';
import { commonMessage } from '@constants/intl';
import useAuth from '@hooks/useAuth';
import useFetch from '@hooks/useFetch';
import useTranslate from '@hooks/useTranslate';
import { IconCircleCheck, IconCircleX, IconTrash } from '@tabler/icons-react';
import { formatTimeDifference, price, titleNotification } from '@utils';
import React, { useEffect, useState } from 'react';
import { defineMessages } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import styles from './DropDown.module.scss';
import { Tooltip } from 'antd';
const message = defineMessages({
    All: 'Tất cả',
    Unread: 'Chưa đọc',
    readAll: 'Đọc tất cả',
    delete: 'Xoá tất cả',
    loadMore: 'Xem thêm',
});

const NotificationDropDown = ({
    data,
    executeGetData,
    executeUpdateState,
    loading,
    unReadTotal,
    pageTotal,
    ...props
}) => {
    const [ activeButtonAll, setActiveButtonAll ] = useState(true);
    const [ activeIcon, setActiveIcon ] = useState(false);
    const translate = useTranslate();
    const [ dataNotification, setDataNotification ] = useState([]);
    const [ isLoadMore, setIsLoadMore ] = useState(false);
    const [ countLoadMore, setCountLoadMore ] = useState(1);
    const [ hiddenItems, setHiddenItems ] = useState([]);
    const [ deleteAll, setDeleteAll ] = useState(false);
    const [ readAll, setReadAll ] = useState(false);
    const [ dataNotificationUnRead, setDataNotificationUnRead ] = useState([]);
    const [ hasNotification, setHasNotification ] = useState(false);
    const navigate = useNavigate();
    const hostPath = window.location.host;
    const { execute: executeReadAll } = useFetch(apiConfig.notification.readAll, {
        immediate: false,
    });
    const { execute: executeDeleteAll } = useFetch(apiConfig.notification.deleteAll, {
        immediate: false,
    });

    useEffect(() => {
        const interval = setInterval(() => {
            const hasNotificationLocalStr = JSON.parse(localStorage.getItem(storageKeys.HAS_NOTIFICATION));
            if (hasNotificationLocalStr && !hasNotification) {
                setHasNotification(true);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (isLoadMore && data) {
            setDataNotification([ ...dataNotification, ...data ]);
        } else {
            setDataNotification(data);
        }
    }, [ data ]);
    useEffect(() => {
        setDataNotificationUnRead(dataNotification?.filter((item) => item.state == 0));
    }, [ dataNotification ]);
    useEffect(() => {
        if (activeIcon) {
            if (activeButtonAll) {
                executeGetData();
            } else {
                executeGetData({
                    params: { state: 0 },
                });
            }
        }
        setReadAll(false);
        setDeleteAll(false);
        localStorage.setItem(storageKeys.HAS_NOTIFICATION, false);
        setHasNotification(false);

        // setHiddenItems([]);
    }, [ activeIcon ]);

    useEffect(() => {
        if (activeIcon) {
            if (!activeButtonAll) {
                executeGetData({
                    params: { state: 0 },
                });
            } else {
                executeGetData();
            }
        }
        setIsLoadMore(false);
        // setCountLoadMore(1);
        setHiddenItems([]);
    }, [ activeButtonAll ]);

    const iconNotification = (kind, style, size) => {
        if (kind == notificationKind.NOTIFICATION_KIND_REJECT_SELLER) {
            return <IconCircleX color="red" style={style} size={30} />;
        } else kind != notificationKind.NOTIFICATION_KIND_REJECT_SELLER;
        {
            return <IconCircleCheck color="green" style={style} size={30} />;
        }
    };
    const titleNotification = (item) => {
        const kind = item?.kind;

        if (kind == notificationKind.NOTIFICATION_KIND_ORDER_SUCCESS) {
            return translate.formatMessage(commonMessage.notificationOrderSuccessMess, {
                orderCode: `#${item?.orderCode ? item.orderCode : '##'}`,
            });
        }
    };

    const handleOnClickChecked = (id) => {
        // e.stopPropagation();
        executeUpdateState({
            data: { id },
        });

        if (hiddenItems?.length == dataNotificationUnRead?.length - 1) {
            setReadAll(true);
        }
        setHiddenItems([ ...hiddenItems, id ]);
    };

    // const handleLoadMore = () => {
    //     setIsLoadMore(true);
    //     if (!activeButtonAll) {
    //         executeGetData({
    //             params: { state: 0, page: countLoadMore },
    //         });
    //     } else {
    //         executeGetData({
    //             params: { page: countLoadMore },
    //         });
    //     }
    //     setCountLoadMore((countLoadMore += 1));
    // };
    // const handleReadAll = () => {
    //     executeReadAll();
    //     setReadAll(true);
    // };

    const handleDeleteAll = () => {};
    const handleClickItem = (item) => {
        const kind = item?.kind;
        executeUpdateState({
            data: { id: item?.id },
        });
        if (hiddenItems?.length == dataNotificationUnRead?.length - 1) {
            setReadAll(true);
        }
        setHiddenItems([ ...hiddenItems, item?.id ]);
        setActiveIcon(false);
    };
    return (
        <div>
            <div>
                <Tooltip title="Thông báo">
                    <div
                        style={{ color: 'var(--primary-color)' }}
                        onClick={() => {
                            activeIcon ? setActiveIcon(false) : setActiveIcon(true);
                        }}
                    >
                        {(unReadTotal > 0 && !readAll && !deleteAll && !loading) || hasNotification ? (
                            <Notification />
                        ) : (
                            <Notification />
                        )}
                    </div>
                </Tooltip>
            </div>
            {activeIcon && (
                // Đặt ref cho toàn bộ khung dropdown
                <div className={styles.notiBox}>
                    <span size={'var(--h3-font-size)'}>{translate.formatMessage(commonMessage.notification)}</span>
                </div>
            )}
        </div>
    );
};

export default NotificationDropDown;
