import { COMBO_KIND, COURSE_NO_LESSON, SINGLE_KIND, notificationKind } from '@constants';
import { defineMessages } from 'react-intl';
import { commonMessage } from '@constants/intl';

export const NOTIFICATION_KIND_ORDER_SUCCESS = 1;

export const STATUS_PENDING = 0;
export const STATUS_ACTIVE = 1;
export const STATUS_LOCK = -1;
export const STATUS_DELETE = -2;
export const STATUS_INACTIVE = -1;
export const STATE_NOPAID = false;
export const STATE_PAIDED = true;

export const PAYPAL_METHOD = 1;
export const COD_METHOD = 0;

export const STATE_PENDING = 1;
export const STATE_CONFIRMED = 2;
export const STATE_CANCELED = 3;
export const STATE_COMPLETED = 4;

const isPaidMessage = defineMessages({
    STATE_NOPAID: 'Chưa thanh toán',
    STATE_PAIDEDD: 'Đã thanh toán',
});

const orderStateMessage = defineMessages({
    STATE_PENDING: 'Đang xử lý',
    STATE_CONFIRMED: 'Đã được duyệt',
    STATE_COMPLETED: 'Đã hoàn thành',
    STATE_CANCELED: 'Đã hủy',
});

export const languageOptions = [
    { value: 1, label: 'EN' },
    { value: 2, label: 'VN' },
    { value: 3, label: 'Other' },
];

export const fitlerCourseOptions = [
    { value: '1', label: 'Mới Nhất', color: 'yellow' },
    { value: '2', label: 'Có nhiều đánh giá nhất', color: 'green' },
];

export const notiMessMessage = {
    [NOTIFICATION_KIND_ORDER_SUCCESS]: commonMessage.notificationOrderSuccessMess,
};

export const formSize = {
    small: '700px',
    normal: '800px',
    big: '900px',
};

export const statusOptions = [
    { value: STATUS_ACTIVE, label: commonMessage.statusActive, color: '#00A648' },
    { value: STATUS_PENDING, label: commonMessage.statusPending, color: '#FFBF00' },
    { value: STATUS_INACTIVE, label: commonMessage.statusInactive, color: '#CC0000' },
];

export const paidValues = [
    { value: STATE_NOPAID, label: isPaidMessage.STATE_NOPAID, color: 'yellow' },
    { value: STATE_PAIDED, label: isPaidMessage.STATE_PAIDEDD, color: 'green' },
];

export const orderStateOption = [
    { value: STATE_PENDING, label: orderStateMessage.STATE_PENDING, color: '#07c1be' },
    { value: STATE_CONFIRMED, label: orderStateMessage.STATE_CONFIRMED, color: '#d9d208' },
    { value: STATE_COMPLETED, label: orderStateMessage.STATE_COMPLETED, color: '#25f221' },
    { value: STATE_CANCELED, label: orderStateMessage.STATE_CANCELED, color: '#f52828' },
];

export const userStateMessage = defineMessages({
    LOCKED_USER: 'Khóa',
    ACTIVE_USER: 'Kích hoạt',
    NO_ACTIVE_USER: 'Chưa kích hoạt',
});
