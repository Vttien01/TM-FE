import React from 'react';
import {
    IconBook,
    IconCamera,
    IconCoins,
    IconAlertTriangle,
    IconCheck,
    Icon123,
    IconExclamationCircle,
    IconBell,
} from '@tabler/icons-react';
import { notification } from 'antd';
const showSucsessMessage = (content, translate) => {
    notification.success({
        message: translate?.t(`${translate.ns}:success`, 'Success') || 'Success',
        description: content,
    });
};

const showErrorMessage = (content, translate) => {
    notification.error({
        message: translate?.t(`${translate.ns}:error`, 'Error') || 'Error',
        description: content,
    });
};

const showWarningMessage = (content, translate) => {
    notification.warning({
        message: translate?.t(`${translate.ns}:error`, 'Error Message') || 'Warning',
        description: content,
    });
};

const showInfoMessage = (content, translate) => {
    // notifications.show({
    //     color: 'cyan',
    //     title: translate?.t(`${translate.ns}:error`, 'Error Message') || 'Thông báo',
    //     message: content,
    //     icon: <IconBell />,
    //     autoClose: 2000,
    // });
};

export { showErrorMessage, showWarningMessage, showSucsessMessage, showInfoMessage };
