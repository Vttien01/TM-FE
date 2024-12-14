import { sendRequest } from '@services/api';
import { getCacheAccessToken } from '@services/userService';
import { useCallback, useEffect, useRef, useState } from 'react';
import useTranslate from './useTranslate';
import { showInfoMessage } from '@services/notifyService';
import { price } from '@utils';
import { notificationKind, storageKeys } from '@constants';
import { commonMessage } from '@constants/intl';

const notiMessMessage = {
    [notificationKind.NOTIFICATION_KIND_ORDER_SUCCESS]: commonMessage.notificationOrderSuccessMess,
};
export const ReadyState = {
    Connecting: 0,
    Open: 1,
    Closing: 2,
    Closed: 3,
};
const useWebSocket = (socketUrl, options = {}) => {
    const tokenLogin = getCacheAccessToken();
    const translate = useTranslate();
    const [ error, setError ] = useState(null);
    const {
        reconnectLimit = 10,
        reconnectInterval = 3 * 1000,
        manual = false,
        onOpen,
        onClose,
        onMessage,
        onError,
        protocols,
    } = options;
    const reconnectTimesRef = useRef(0);
    const reconnectTimerRef = useRef();

    const websocketRef = useRef();

    const [ latestMessage, setLatestMessage ] = useState();
    const [ readyState, setReadyState ] = useState(ReadyState.Closed);

    const reconnect = () => {
        if (reconnectTimesRef.current < reconnectLimit && websocketRef.current?.readyState !== ReadyState.Open) {
            if (reconnectTimerRef.current) {
                clearTimeout(reconnectTimerRef.current);
            }

            reconnectTimerRef.current = setTimeout(() => {
                connectWs();
                reconnectTimesRef.current++;
            }, reconnectInterval);
        }
    };
    const connectWs = () => {
        if (reconnectTimerRef.current) {
            clearTimeout(reconnectTimerRef.current);
        }

        if (websocketRef.current) {
            websocketRef.current.close();
        }

        const ws = new WebSocket(socketUrl, protocols);
        setReadyState(ReadyState.Connecting);

        ws.onerror = (event) => {
            if (websocketRef.current !== ws) {
                return;
            }
            reconnect();
            // onErrorRef.current?.(event, ws);
            setReadyState(ws.readyState || ReadyState.Closed);
        };
        ws.onopen = (event) => {
            if (websocketRef.current !== ws) {
                return;
            }

            console.log('Connecting');
            if (tokenLogin) {
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
                websocketRef.current?.send(JSON.stringify(client_info));
            }
            // onOpenRef.current?.(event, ws);
            reconnectTimesRef.current = 0;
            setReadyState(ws.readyState || ReadyState.Open);
        };
        ws.onmessage = (e) => {
            if (websocketRef.current !== ws) {
                return;
            }
            const data = JSON.parse(e?.data)?.data;
            if (JSON.stringify(data) !== '{}') {
                const dataNotification = data?.message ? JSON.parse(data.message) : null;
                if (data?.kind > 0 && data?.kind <= 7) {
                    showInfoMessage(
                        translate.formatMessage(notiMessMessage[data?.kind], {
                            revenueMoney: price(dataNotification?.revenueMoney),
                            courseName: dataNotification?.courseName,
                        }),
                    );
                    setLatestMessage((prev) => [ ...prev, data ]);
                }

                localStorage.setItem(storageKeys.HAS_NOTIFICATION, true);
            }
            // onMessageRef.current?.(message, ws);
            // setLatestMessage(message);
        };
        ws.onclose = (event) => {
            // onCloseRef.current?.(event, ws);
            // closed by server
            if (websocketRef.current === ws) {
                reconnect();
            }
            // closed by disconnect or closed by server
            if (!websocketRef.current || websocketRef.current === ws) {
                setReadyState(ws.readyState || ReadyState.Closed);
            }
        };

        websocketRef.current = ws;
    };

    const sendMessage = (message) => {
        if (readyState === ReadyState.Open) {
            websocketRef.current?.send(message);
        } else {
            // throw new Error('WebSocket disconnected');
            console.error('WebSocket disconnected');
        }
    };
    const connect = () => {
        reconnectTimesRef.current = 0;
        connectWs();
        setInterval(() => {
            doPing();
        }, 30000);
    };
    function doPing() {
        if (tokenLogin) {
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

            websocketRef.current.send(JSON.stringify(pingRequest));
            console.log('Pingggggggg');
        }
    }
    const disconnect = () => {
        if (readyState === ReadyState.Open) {
            console.log('DISCONNECTED');
            if (reconnectTimerRef.current) {
                clearTimeout(reconnectTimerRef.current);
            }

            reconnectTimesRef.current = reconnectLimit;
            websocketRef.current?.close();
            websocketRef.current = undefined;
        }
    };

    useEffect(
        () => () => {
            disconnect();
        },
        [],
    );

    return { readyState, webSocketIns: websocketRef.current, latestMessage, connect, disconnect, sendMessage, doPing };
};

export default useWebSocket;
