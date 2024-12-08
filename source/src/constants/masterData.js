import { COMBO_KIND, COURSE_NO_LESSON, SINGLE_KIND, notificationKind } from '@constants';
import { defineMessages } from 'react-intl';

const commonMessage = defineMessages({
    single: 'Khoá học',
    combo: 'Khoá học combo',
    noLesson: 'Khóa học sự kiện',
    statusActive: 'Active',
    statusPending: 'Pending',
    statusInactive: 'Inactive',
});

export const NOTIFICATION_KIND_APRROVE_SELLER = 1;
export const NOTIFICATION_KIND_REJECT_SELLER = 2;
export const NOTIFICATION_KIND_EXPERT_REGISTRATION = 3;
export const NOTIFICATION_KIND_APPROVE_EXPERT = 4;
export const NOTIFICATION_KIND_UPDATE_SELLER = 5;
export const NOTIFICATION_KIND_SING_UP_STUDENT = 6;
export const NOTIFICATION_KIND_RECEIVE_REVENUE = 7;
export const NOTIFICATION_KIND_ORDER_SUCCESS = 10;
export const NOTIFICATION_KIND_BOOKING_REJECT = 11;
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

export const courseKindOptions = [
    { value: 1, label: commonMessage.single, color: 'blue' },
    { value: 3, label: commonMessage.noLesson, color: 'green' },
    { value: 2, label: commonMessage.combo, color: 'orange' },
];

export const notiMessMessage = {
    [NOTIFICATION_KIND_APRROVE_SELLER]: commonMessage.notificationAprroveSeller,
    [NOTIFICATION_KIND_REJECT_SELLER]: commonMessage.notificationRejectSeller,
    [NOTIFICATION_KIND_EXPERT_REGISTRATION]: commonMessage.notificationExpertRegistration,
    [NOTIFICATION_KIND_APPROVE_EXPERT]: commonMessage.notficationApproveExpert,
    [NOTIFICATION_KIND_UPDATE_SELLER]: commonMessage.notficationUpdateSeller,
    [NOTIFICATION_KIND_SING_UP_STUDENT]: commonMessage.notificationSingUpStudent,
    [NOTIFICATION_KIND_RECEIVE_REVENUE]: commonMessage.notificationReviceRevenueMess,
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
