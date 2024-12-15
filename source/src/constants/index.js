import { defineMessages } from 'react-intl';
import { userStateMessage } from './masterData';
import iconMoney from '@assets/icons/iconMoney.png';
import iconPaypal from '@assets/icons/paypal.png';
import iconVnpay from '@assets/icons/vnpay.png';

export const apiUrl = process.env.REACT_APP_API;
export const enableExposure = process.env.REACT_APP_ENABLE_EXPOSURE === 'true';
export const apiUrlSSO = process.env.REACT_APP_API_SSO;
export const apiFrontend = process.env.REACT_APP_FRONTEND;

export const fixedPath = {
    privacy: `${apiUrl}${process.env.REACT_APP_PRIVACY_PATH}`,
    help: `${apiUrl}${process.env.REACT_APP_HELP_PATH}`,
    aboutUs: `${apiUrl}${process.env.REACT_APP_ABOUT_US_PATH}`,
};

//LTS SHOP

export const brandName = 'sell-mgr-portal';
export const DEFAULT_TABLE_PAGE_START = 0;
export const LOCKED_ACCOUNT = -1;
export const ACTIVE_ACCOUNT = 1;

export const CLIENT_APP = 1;

export const appName = `sell-portal-${process.env.REACT_APP_ENV}`;

export const storageKeys = {
    USER_ACCESS_TOKEN: `${appName}-user-access-token`,
    USER_REFRESH_TOKEN: `${appName}-user-refresh-token`,
    USER_KIND: `${appName}-user-kind`,
    REF_CODE: `${appName}-ref-code`,
    ITEM_CART: `${appName}-item-cart`,
    HAS_NOTIFICATION: `${appName}-hasNotification`,
    BUY_COURSE_DIRECT: `${appName}-buyCourseDirect`,
    IGNORE_AUTH: ` ${appName}-ignore-auth`,
};

export const AppConstants = {
    apiRootUrl: process.env.REACT_APP_API,
    clientUrl: process.env.REACT_APP_CLIENT_URL,
    contentRootUrl: `${process.env.REACT_APP_API_MEDIA}v1/file/download`,
    mediaRootUrl: `${process.env.REACT_APP_API_MEDIA}`,
    gameApiRootUrl: process.env.REACT_APP_GAME_API,
    langKey: 'vi',
    wsUri: process.env.REACT_APP_WEB_SOCKET_URL,
};

export const THEMES = {
    DARK: 'dark',
    LIGHT: 'light',
};

export const defaultLocale = 'en';
export const locales = [ 'en', 'vi' ];

export const DATE_DISPLAY_FORMAT = 'hh:mm A DD/MM/YYYY';
export const DATE_SHORT_MONTH_FORMAT = 'DD MMM YYYY';
export const TIME_FORMAT_DISPLAY = 'HH:mm';
export const DATE_FORMAT_DISPLAY = 'DD/MM/YYYY';
export const DEFAULT_FORMAT = 'DD/MM/YYYY HH:mm:ss';
export const DATE_FORMAT_VALUE = 'DD/MM/YYYY';

export const SHOW_SYSTEM_SETTING = 1;

export const navigateTypeEnum = {
    PUSH: 'PUSH',
    POP: 'POP',
    REPLACE: 'REPLACE',
};

export const articleTypeEnum = {
    URL: 'url',
    PLAIN: 'plain',
};

export const accessRouteTypeEnum = {
    NOT_LOGIN: false,
    REQUIRE_LOGIN: true,
    BOTH: null,
};

export const accessProfileTypeEnum = {
    NOT_SELLER: false,
    REQUIRE_SELLER: true,
    BOTH: null,
};

export const UploadFileTypes = {
    AVATAR: 'AVATAR',
    LOGO: 'LOGO',
    DOCUMENT: 'DOCUMENT',
};

export const LIMIT_IMAGE_SIZE = 512000;

export const STATUS_PENDING = 0;
export const STATUS_ACTIVE = 1;
export const STATUS_LOCK = -1;
export const STATUS_DELETE = -2;
export const STATUS_INACTIVE = -1;

export const DEFAULT_PAGE_SIZE = 12;
export const DEFAULT_PAGE_REVIEW = 3;
export const DEFAULT_TABLE_ITEM_SIZE = 20;
export const DEFAULT_LANGUAGE_ID = '1';

export const NOTIFICATION_KIND_VOUCHER = 0;
export const NOTIFICATION_KIND_ORDER_SUCCESS = 1;
export const NOTIFICATION_KIND_REVIEW = 2;

export const BOOKING_STATE_UNPAID = 0;
export const BOOKING_STATE_PAID = 1;
export const BOOKING_STATE_REJECT = 2;

export const STATE_NOPAID = false;
export const STATE_PAIDED = true;

export const PAYPAL_METHOD = 1;
export const COD_METHOD = 0;
export const VNPAY_METHOD = 2;

export const GENDER_MAN = 0;
export const GENDER_WOWAN = 1;
export const GENDER_OTHER = 2;

export const notificationKind = {
    NOTIFICATION_KIND_ORDER_SUCCESS,
    NOTIFICATION_KIND_VOUCHER,
    NOTIFICATION_KIND_REVIEW,
};
export const commonStatus = {
    PENDING: 0,
    ACTIVE: 1,
    LOCK: -1,
    DELETE: -2,
};

export const commonStatusColor = {
    [commonStatus.PENDING]: 'warning',
    [commonStatus.ACTIVE]: 'green',
    [commonStatus.LOCK]: 'red',
};

export const CurrentcyPositions = {
    FRONT: 0,
    BACK: 1,
};

export const USER_DATA = 'user-data';
export const LANGUAGE = 'language';

export const KEYS = {
    USER_DATA,
    LANGUAGE,
};

export const shopVariantKey = {
    color: 0,
    size: 1,
};

export const FieldTypes = {
    STRING: 'STRING_TYPE',
    NUMBER: 'NUMBER_TYPE',
    SELECT: 'SELECT',
    AUTOCOMPLETE: 'AUTOCOMPLETE',
    DATE: 'DATE',
    DATE_RANGE: 'DATE_RANGE',
};

export const appAccount = {
    APP_USERNAME: process.env.REACT_APP_USERNAME,
    APP_PASSWORD: process.env.REACT_APP_PASSWORD,
};

export const GROUP_KIND_STUDENT = 4;
export const GROUP_KIND_EXPERT = 5;
export const GROUP_KIND_SELLER = 6;
export const UserTypes = {
    STUDENT: 4,
    EXPERT: 5,
    SELLER: 6,
};
export const PROVINCE_KIND = 1;
export const DISTRICT_KIND = 2;
export const VILLAGE_KIND = 3;
export const nationKinds = {
    PROVINCE_KIND,
    DISTRICT_KIND,
    VILLAGE_KIND,
};

export const MAX_LENGTH_TEXT_EDITOR = 2000;

export const BOOKING_PAYMENT_METHOD_MOMO = 0;
export const BOOKING_PAYMENT_METHOD_CREDIT = 1;
export const BOOKING_PAYMENT_METHOD_WALLET = 2;
export const paymentMethods = {
    BOOKING_PAYMENT_METHOD_CREDIT,
    BOOKING_PAYMENT_METHOD_MOMO,
    BOOKING_PAYMENT_METHOD_WALLET,
};
export const REVIEW_KIND_EXPERT = 1;
export const REVIEW_KIND_COURSE = 2;
export const REVIEW_KIND_SYSTEM = 3;
export const reviewKind = {
    REVIEW_KIND_EXPERT,
    REVIEW_KIND_COURSE,
    REVIEW_KIND_SYSTEM,
};
export const LESSON_KIND_TEXT = 1;
export const LESSON_KIND_VIDEO = 2;
export const LESSON_KIND_SECTION = 3;
export const lessonKinds = {
    LESSON_KIND_TEXT,
    LESSON_KIND_VIDEO,
    LESSON_KIND_SECTION,
};
export const CATEGORY_KIND_NEWS = 1;
export const CATEGORY_KIND_TOP_FREE = 2;
export const CATEGORY_KIND_TOP_CHARGE = 3;
export const CATEGORY_KIND_TOP_NEW = 4;
export const CATEGORY_KIND_BULETIN = 5;

export const categoryKinds = {
    CATEGORY_KIND_NEWS,
    CATEGORY_KIND_TOP_FREE,
    CATEGORY_KIND_TOP_CHARGE,
    CATEGORY_KIND_TOP_NEW,
    CATEGORY_KIND_BULETIN,
};
export const SINGLE_KIND = 1;
export const COMBO_KIND = 2;
export const COURSE_NO_LESSON = 3;

export const HTTP_UNAUTHORIZED = 401;
export const HTTP_FORBIDDEN = 403;
export const HTTP_NOT_FOUND = 404;
export const httpStatus = {
    HTTP_UNAUTHORIZED,
    HTTP_FORBIDDEN,
    HTTP_NOT_FOUND,
};

export const WALLET_TRANSACTION_KIND_IN = 1;
export const WALLET_TRANSACTION_KIND_WITH_DRAW = 2;
export const WALLET_TRANSACTION_KIND_INIT_MONEY = 3;
export const WALLET_TRANSACTION_KIND_BUY_COURSE = 4;

export const STATE_PENDING = 1;
export const STATE_CONFIRMED = 2;
export const STATE_CANCELED = 3;
export const STATE_COMPLETED = 4;

export const SettingTypes = {
    Money: 'Money',
    Timezone: 'Timezone',
    System: 'System',
    RevenueShare: 'revenue_share',
    payout: 'payout',
    bankInfo: 'bank_info',
    wallet: 'wallet',
};

const paymentMessage = defineMessages({
    PAYPAL_METHOD: 'PayPal',
    COD_METHOD: 'Tiền mặt',
    VNPAY_METHOD: 'VNPAY',
});

export const paymentSelect = [
    { value: 0, label: 'Thanh toán tiền mặt', color: '#00A648' },
    { value: 1, label: 'Thanh toán PAYPAL', color: '#00adf9' },
    { value: 2, label: 'Thanh toán VNPAY', color: 'blue' },
];

export const paymentSelectIcon = [
    { value: 0, label: 'Thanh toán tiền mặt', icon: iconMoney },
    { value: 1, label: 'Thanh toán PAYPAL', icon: iconPaypal },
    { value: 2, label: 'Thanh toán VNPAY', icon: iconVnpay },
];

export const paymentOptions = [
    { value: COD_METHOD, label: paymentMessage.COD_METHOD, color: '#00A648' },
    { value: PAYPAL_METHOD, label: paymentMessage.PAYPAL_METHOD, color: '#00adf9' },
    { value: VNPAY_METHOD, label: paymentMessage.VNPAY_METHOD, color: 'blue' },
];

export const accountStatusOptions = [
    { value: LOCKED_ACCOUNT, label: userStateMessage.LOCKED_USER, color: 'red' },
    { value: ACTIVE_ACCOUNT, label: userStateMessage.ACTIVE_USER, color: 'green' },
];

export const genderValues = [
    { label: 'Nam', value: GENDER_MAN },
    { label: 'Nữ', value: GENDER_WOWAN },
    { label: 'kHÁC', value: GENDER_OTHER },
];
