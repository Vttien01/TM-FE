import { FormattedMessage, defineMessages } from 'react-intl';

export const errorMessage = defineMessages({
    ACCOUNT_ERROR_NOT_FOUND: 'Tài Khoản không tồn tại',
    ACCOUNT_ERROR_OPT_INVALID: 'Mã xác thực không hợp lệ',
    ACCOUNT_ERROR_WRONG_PASSWORD: 'Mật khẩu không đúng ',
    USER_ERROR_PHONE_EXISTS: 'Số điện thoại đã tồn tại',
    USER_ERROR_GG_EXISTS: 'Số điện thoại đã tồn tại',
    USER_EMAIL_GG_EXISTS: 'Email đã tồn tại',
    ERROR_STUDENT_0001: 'Tài Khoản đã bị xoá',
    EXPERT_REGISTRATION_ERROR_PHONE_OR_EMAIL_ALREADY_USED: 'Số điện thoại hoặc email đã được sử dụng',
    COURSE_TRANSACTION_EXITS: 'Khóa học này đã được mua ',
    ERROR_CART_ITEM_EXITS: 'Khóa học này đã được mua hoặc đã được mua cùng gói',
    ERROR_BOOKING_ENOUGHT: 'Không đủ số dư trong ví!',
    ERROR_REGISTRATION_CART_EXITS : "Khóa học này đã được đăng ký ",
    REF_CODE_STUDENT_ERROR_INVALID : "Mã giới thiệu không hợp lệ",

});

export const ACCOUNT_ERROR_NOT_FOUND = 'ERROR-ACCOUNT-0002';
export const ACCOUNT_ERROR_WRONG_PASSWORD = 'ERROR-ACCOUNT-0003';
export const ACCOUNT_ERROR_OPT_INVALID = 'ERROR-ACCOUNT-0006';
export const ACCOUNT_ERROR_EMAIL_EXISTS = 'ERROR-ACCOUNT-0014';
export const USER_ERROR_PHONE_EXISTS = 'ERROR-USER-0000';
export const USER_ERROR_GG_EXISTS = 'ERROR-USER-0000';
export const USER_EMAIL_GG_EXISTS = 'ERROR-ACCOUNT-0015';
export const ERROR_STUDENT_0001 = 'ERROR-STUDENT-0001';
export const STUDENT_REFERRAL_CODE_INVALID = 'ERROR-STUDENT-0004';

export const EXPERT_REGISTRATION_ERROR_PHONE_OR_EMAIL_ALREADY_USED = 'ERROR-EXPERT-REGISTRATION-0002';

export const COURSE_TRANSACTION_EXITS = 'ERROR-COURSE-TRANSACTION-0001';

export const ERROR_CART_ITEM_EXITS = 'ERROR-CART-ITEM-0001';
export const ERROR_REGISTRATION_CART_EXITS = "ERROR-REGISTRATION-0001";

export const REF_CODE_ERROR_INVALID = "ERROR-EXPERT-REGISTRATION-0003";
export const REF_CODE_STUDENT_ERROR_INVALID ="ERROR-STUDENT-0004";