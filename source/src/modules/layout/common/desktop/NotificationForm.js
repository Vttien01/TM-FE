import { DEFAULT_FORMAT, DEFAULT_TABLE_ITEM_SIZE, notificationKind, UserTypes } from '@constants';
import apiConfig from '@constants/apiConfig';
import useAuth from '@hooks/useAuth';
import useFetch from '@hooks/useFetch';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import routes from '@routes';
import {
    IconBasketDiscount,
    IconBell,
    IconBellFilled,
    IconCheck,
    IconCircleCheck,
    IconCircleX,
    IconGiftCard,
    IconInfoCircle,
    IconMessageReply,
} from '@tabler/icons-react';
import HeadlessTippy from '@tippyjs/react/headless';
import { convertDateTimeToString, convertStringToDateTime } from '@utils/dayHelper';
import { Badge, Button, Card, Flex, Modal, Skeleton } from 'antd';
import React, { useEffect, useState } from 'react';
import { defineMessages } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import styles from './NotificationForm.module.scss';
import { IconBellRinging } from '@tabler/icons-react';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import { orderStateOption } from '@constants/masterData';
const messages = defineMessages({
    doneTaskDescription: 'Bạn đã hoàn thành task: ',
    studentNewTaskDescription: 'Bạn đã được giao task: ',
    cancelTaskDescription: 'Bạn đã bị huỷ task : ',
    leaderNewTaskDescription: 'Một task mới được tạo: ',
    leaderDoneTaskDescription: 'Thông báo xong task: ',
    deleteAllConfirm: 'Bạn có muốn xoá toàn bộ thông báo không ?',
});

export const NotificationForm = ({
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
    let [ countLoadMore, setCountLoadMore ] = useState(1);
    const [ hiddenItems, setHiddenItems ] = useState([]);
    const [ deleteAll, setDeleteAll ] = useState(false);
    const [ readAll, setReadAll ] = useState(false);
    const [ dataNotificationUnRead, setDataNotificationUnRead ] = useState([]);
    const [ hasNotification, setHasNotification ] = useState(false);
    const navigate = useNavigate();
    const hostPath = window.location.host;
    const { profile } = useAuth();
    const orderStatetateValues = translate.formatKeys(orderStateOption, [ 'label' ]);
    const { execute: executeReadAll } = useFetch(apiConfig.notification.readAll, {
        immediate: false,
    });
    const { execute: executeDeleteAll } = useFetch(apiConfig.notification.deleteAll, {
        immediate: false,
    });
    useEffect(() => {
        const interval = setInterval(() => {
            const hasNotificationLocalStr = JSON.parse(localStorage.getItem('hasNotification'));
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
                executeGetData({
                    params: {
                        size: DEFAULT_TABLE_ITEM_SIZE,
                    },
                });
            } else {
                executeGetData({
                    params: { state: 0, size: DEFAULT_TABLE_ITEM_SIZE },
                });
            }
            setReadAll(false);
            setDeleteAll(false);
            localStorage.setItem('hasNotification', false);
            setHasNotification(false);
        }
        setHiddenItems([]);
    }, [ activeIcon ]);

    useEffect(() => {
        if (activeIcon) {
            if (!activeButtonAll) {
                executeGetData({
                    params: { state: 0, size: DEFAULT_TABLE_ITEM_SIZE },
                });
            } else {
                executeGetData({
                    params: {
                        size: DEFAULT_TABLE_ITEM_SIZE,
                    },
                });
            }
        }
        setIsLoadMore(false);
        setCountLoadMore(1);
        setHiddenItems([]);
    }, [ activeButtonAll ]);
    const iconNotification = (kind, style, size) => {
        if (kind == 1) {
            return <IconCircleCheck color="green" style={style} size={size} />;
        } else if (kind == 0) {
            return <IconBasketDiscount color="blue" style={style} size={size} />;
        } else {
            return <IconMessageReply color="red" style={style} size={size} />;
        }
    };
    const titleNotification = (item) => {
        const kind = item?.kind;

        if (kind == notificationKind.NOTIFICATION_KIND_ORDER_SUCCESS) {
            const stateTitle = orderStatetateValues.find((itemX) => itemX.value == item?.stateOrder);
            return translate.formatMessage(commonMessage.notificationOrderSuccessMess, {
                orderId: `#${item?.orderCode ? item.orderCode : '##'}`,
                stateTitle: stateTitle?.label != null ? stateTitle.label.toLowerCase() : '',
            });
        }
        if (kind == notificationKind.NOTIFICATION_KIND_VOUCHER) {
            return translate.formatMessage(commonMessage.notificationOrderVoucher, {
                amount: `${item?.amount ? item.amount : '0'}`,
                percent: `${item?.percent ? item.percent : '0'}`,
            });
        }
        if (kind == notificationKind.NOTIFICATION_KIND_REVIEW) {
            return translate.formatMessage(commonMessage.notificationOrderFeedback, {
                title: `#${item?.orderCode ? item.orderCode : '##'}`,
            });
        }
    };
    const descriptionNotification = (item) => {
        const kind = item?.kind;
        const title = item?.title;
        if (kind == notificationKind.NOTIFICATION_KIND_VOUCHER) {
            return title ? `Tiêu đề: ${title}` : '';
        }
    };
    const timeNotification = (createdDate) => {
        const dateTime = convertStringToDateTime(createdDate, DEFAULT_FORMAT, DEFAULT_FORMAT).add(7, 'hour');
        const dateTimeString = convertDateTimeToString(dateTime, DEFAULT_FORMAT);
        return dateTimeString;
    };
    const handleOnClickChecked = (e, id) => {
        e.stopPropagation();
        executeUpdateState({
            data: { id },
        });

        if (hiddenItems?.length == dataNotificationUnRead?.length - 1) {
            setReadAll(true);
        }
        setHiddenItems([ ...hiddenItems, id ]);
    };

    const handleLoadMore = () => {
        setIsLoadMore(true);
        if (!activeButtonAll) {
            executeGetData({
                params: { state: 0, page: countLoadMore, size: DEFAULT_TABLE_ITEM_SIZE },
            });
        } else {
            executeGetData({
                params: { page: countLoadMore, size: DEFAULT_TABLE_ITEM_SIZE },
            });
        }
        setCountLoadMore((countLoadMore += 1));
    };
    const handleReadAll = () => {
        executeReadAll();
        setReadAll(true);
    };
    const handleDeleteAll = () => {
        Modal.confirm({
            title: translate.formatMessage(messages.deleteAllConfirm),
            centered: true,
            okText: translate.formatMessage(commonMessage.yes),
            okType: 'danger',
            cancelText: translate.formatMessage(commonMessage.no),
            onOk: () => {
                executeDeleteAll();
                setDeleteAll(true);
            },
        });
    };
    const handleClickItem = (item) => {
        const kind = item?.kind;
        console.log(item);
        executeUpdateState({
            data: { id: item?.id },
        });
        if (hiddenItems?.length == dataNotificationUnRead?.length - 1) {
            setReadAll(true);
        }
        setHiddenItems([ ...hiddenItems, item?.id ]);
    };

    return (
        <HeadlessTippy
            interactive
            placement="bottom-end"
            trigger="click"
            onClickOutside={() => setActiveIcon(false)}
            visible={activeIcon}
            className="headlessTippy"
            onShow={() => {
                setActiveIcon(true);
            }}
            onHide={() => {
                setActiveIcon(false);
            }}
            offset={[ 30, 12 ]}
            render={(attrs) => (
                <Card className={styles.wrapper}>
                    <div className={styles.content}>
                        <div className={styles.wrapperButton}>
                            <div>
                                <Button
                                    type={activeButtonAll ? 'primary' : 'default'}
                                    shape="round"
                                    onClick={() => {
                                        setActiveButtonAll(true);
                                    }}
                                    style={{ marginRight: '4px' }}
                                >
                                    {translate.formatMessage(commonMessage.all)}
                                </Button>
                                <Button
                                    type={!activeButtonAll ? 'primary' : 'default'}
                                    shape="round"
                                    onClick={() => {
                                        setActiveButtonAll(false);
                                    }}
                                >
                                    {translate.formatMessage(commonMessage.unRead)}
                                </Button>
                            </div>
                            <div>
                                <Button
                                    type="default"
                                    shape="round"
                                    style={{ marginRight: '4px' }}
                                    onClick={handleReadAll}
                                >
                                    {translate.formatMessage(commonMessage.readAll)}
                                </Button>
                                <Button
                                    style={{ color: 'white', backgroundColor: 'red' }}
                                    type="default"
                                    shape="round"
                                    onClick={handleDeleteAll}
                                >
                                    {translate.formatMessage(commonMessage.deleteAll)}
                                </Button>
                            </div>
                        </div>
                        {loading ? (
                            <div>
                                <Skeleton active paragraph={{ rows: 2 }} />
                                <Skeleton active paragraph={{ rows: 2 }} />
                                <Skeleton active paragraph={{ rows: 2 }} />
                                <Skeleton active paragraph={{ rows: 2 }} />
                            </div>
                        ) : (
                            <div>
                                {dataNotification?.map((item) => {
                                    return (
                                        <div
                                            key={item.id}
                                            className={
                                                styles.notificationItem +
                                                ' ' +
                                                ((item?.state == 1 || hiddenItems.includes(item?.id) || readAll) &&
                                                    styles.viewed)
                                            }
                                            style={{
                                                display:
                                                    (hiddenItems.includes(item?.id) && !activeButtonAll) ||
                                                    deleteAll ||
                                                    (readAll && !activeButtonAll)
                                                        ? 'none'
                                                        : '',
                                            }}
                                            onClick={() => handleClickItem(item)}
                                        >
                                            <Flex align="center">
                                                {iconNotification(item?.kind, { marginRight: '16px' }, 36)}
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        whiteSpace: 'normal',
                                                        width: 'max-content',
                                                        maxWidth: 'calc(100% - 60px)',
                                                    }}
                                                >
                                                    <text style={{ display: 'flex', flexDirection: 'column' }}>
                                                        <span style={{ fontWeight: 700, fontSize: '16px' }}>
                                                            {titleNotification(item)}
                                                        </span>
                                                        <span
                                                            style={{
                                                                fontWeight: 500,
                                                                width: '350px',
                                                                wordWrap: 'break-word',
                                                            }}
                                                        >
                                                            {descriptionNotification(item)}
                                                        </span>
                                                    </text>
                                                    <span style={{ paddingTop: '4px' }}>
                                                        {timeNotification(item?.createdDate)}
                                                    </span>
                                                </div>
                                            </Flex>
                                            {item?.state == 0 && !hiddenItems.includes(item?.id) && !readAll && (
                                                <BaseTooltip title={translate.formatMessage(commonMessage.markAsRead)}>
                                                    <Button
                                                        type="link"
                                                        style={{ paddingRight: '10px' }}
                                                        onClick={(e) => handleOnClickChecked(e, item?.id)}
                                                    >
                                                        <IconCheck color="#2b6fab" />
                                                    </Button>
                                                </BaseTooltip>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        {pageTotal > 0 &&
                            countLoadMore != pageTotal &&
                            !deleteAll &&
                            !(readAll && !activeButtonAll) &&
                            !loading && (
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '6px' }}>
                                <Button onClick={handleLoadMore}>
                                    {translate.formatMessage(commonMessage.loadMore)}
                                </Button>
                            </div>
                        )}
                    </div>
                </Card>
            )}
            {...props}
        >
            <div
                style={{ display: 'flex', alignItems: 'center' }}
                onClick={() => {
                    activeIcon ? setActiveIcon(false) : setActiveIcon(true);
                }}
            >
                <Badge dot={(unReadTotal > 0 && !readAll && !deleteAll && !loading) || hasNotification}>
                    {activeIcon ? (
                        <IconBellFilled color="var(--primary-color)" size={28} />
                    ) : (
                        <IconBell color="var(--primary-color)" size={28} />
                    )}
                </Badge>
            </div>
        </HeadlessTippy>
    );
};
