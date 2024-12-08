import { UserTypes, notificationKind, storageKeys } from '@constants';
import { defineMessages } from 'react-intl';
import { getData } from './localStorage';
import React from 'react';
import { IconBellRinging } from '@tabler/icons-react';
import { showErrorMessage, showInfoMessage, showSucsessMessage, showWarningMessage } from '@services/notifyService';
import { commonMessage } from '@constants/intl';
import { price } from '@utils';

const notiMessMessage = {
    [notificationKind.NOTIFICATION_KIND_APRROVE_SELLER]: commonMessage.notificationAprroveSeller,
    [notificationKind.NOTIFICATION_KIND_REJECT_SELLER]: commonMessage.notificationRejectSeller,
    [notificationKind.NOTIFICATION_KIND_EXPERT_REGISTRATION]: commonMessage.notificationExpertRegistration,
    [notificationKind.NOTIFICATION_KIND_APPROVE_EXPERT]: commonMessage.notficationApproveExpert,
    [notificationKind.NOTIFICATION_KIND_UPDATE_SELLER]: commonMessage.notficationUpdateSeller,
    [notificationKind.NOTIFICATION_KIND_SING_UP_STUDENT]: commonMessage.notificationSingUpStudent,
    [notificationKind.NOTIFICATION_KIND_RECEIVE_REVENUE]: commonMessage.notificationReviceRevenueMess,
    [notificationKind.NOTIFICATION_KIND_ORDER_SUCCESS]: commonMessage.notificationOrderSuccessMess,
};
export const webSocket = (tokenLogin, translate) => {
    var wsUri = process.env.REACT_APP_WEB_SOCKET_URL;
    var websocket;
    var isClosedIntentionally = false;
    document.addEventListener('visibilitychange', handleVisibilityChange);
    function handleVisibilityChange() {
        if(tokenLogin) {
            if (document.visibilityState === 'visible') {
                // If the page becomes visible, reconnect WebSocket
                webSocket();
            } else {
                // If the page becomes hidden, close WebSocket
                if (websocket) {
                    isClosedIntentionally = true;
                    websocket.close();
                }
            }
        }
    }

    function init() {
        webSocket();
        setInterval(() => {
            doPing();
        }, 30000);
    }
    function webSocket() {
        websocket = new WebSocket(wsUri);

        websocket.onopen = onOpen;

        websocket.onclose = onClose;

        websocket.onmessage = onMessage;

        websocket.onerror = onError;
    }
    function onOpen(evt) {
        if(tokenLogin){
            console.log('CONNECTED');
            var client_info = {
                cmd: 'CLIENT_INFO',
                platform: 0,
                clientVersion: '1.0',
                lang: 'vi',
                token: tokenLogin,
                app: 'CLIENT_APP',
                data: {
                    app: 'CLIENT_APP',
                },
            };
            doSend(JSON.stringify(client_info));
        }
    }

    function onClose(evt) {
        if(tokenLogin){
            console.log('DISCONNECTED');
            if (!isClosedIntentionally) {
                setTimeout(() => {
                    webSocket();
                }, 10000);
            }
            isClosedIntentionally = false;
        }
    }

    function onMessage(evt) {
        const data = JSON.parse(evt?.data)?.data;
        if (JSON.stringify(data) !== '{}') {
            const dataNotification = data?.message ? JSON.parse(data.message) : null;
            if (data?.kind > 0 && data?.kind <= 7) {
                showInfoMessage(
                    translate.formatMessage(notiMessMessage[data?.kind], {
                        revenueMoney: price(dataNotification?.revenueMoney),
                        courseName: dataNotification?.courseName,
                    }),
                );
            }

            localStorage.setItem(storageKeys.HAS_NOTIFICATION, true);
        }
        //websocket.close();
    }
    function onError(evt) {
        // console.log(evt.data);
    }

    function doSend(message) {
        if(tokenLogin){
            if (websocket.readyState === WebSocket.OPEN) {
                websocket.send(message);
            } else {
                console.error('WebSocket is in CLOSING or CLOSED state.');
            }
        }
    }
    function doReceived(message) {
        return message;
    }

    function doPing() {
        if(tokenLogin){
            var pingRequest = {
                cmd: 'CLIENT_PING',
                platform: 0,
                clientVersion: '1.0',
                lang: 'vi',
                token: tokenLogin,
                app: 'CLIENT_APP',
                data: {
                    app: 'CLIENT_APP',
                },
            };
            doSend(JSON.stringify(pingRequest));
        }
    }
    init();
};
