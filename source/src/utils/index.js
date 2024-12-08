import qs from 'query-string';
import {
    CurrentcyPositions,
    DATE_FORMAT_DISPLAY,
    DATE_SHORT_MONTH_FORMAT,
    DEFAULT_LANGUAGE_ID,
    THEMES,
    KEYS,
    DEFAULT_FORMAT,
    LESSON_KIND_SECTION,
    notificationKind,
    apiUrl,
} from '@constants';
import dayjs from 'dayjs';
import { getObjectData } from './localStorage';
import { showErrorMessage, showSucsessMessage } from '@services/notifyService';
var utc = require('dayjs/plugin/utc');
dayjs.extend(utc);
import moment from 'moment/moment';
import { commonMessage } from '@constants/intl';
import apiConfig from '@constants/apiConfig';
import axios from 'axios';
import { getCartItemList } from '@store/actions/cart';
require('moment/locale/vi');

export const convertGlobImportToObject = (modules) =>
    modules
        .filter((module) => !!module.default)
        .reduce(
            (rs, cur) => ({
                ...rs,
                [cur.default.name]: cur.default,
            }),
            {},
        );

export const convertGlobImportToArray = (modules) =>
    modules.filter((module) => !!module.default).map((module) => module.default);

export const destructCamelCaseString = (string) => {
    const arrString = [ ...string ];
    const newArrString = [];
    arrString.forEach((char, index) => {
        if (char.charCodeAt(0) > 90) {
            newArrString.push(char);
        } else {
            index && newArrString.push('-');
            newArrString.push(char.toLowerCase());
        }
    });
    return newArrString.join('');
};

export const getBrowserTheme = () => {
    const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    return isDark ? THEMES.DARK : THEMES.LIGHT;
};

export const makeURL = (baseURL, params, pathParams) => {
    for (let key of Object.keys(pathParams || {})) {
        const keyCompare = `:${key}`;
        if (baseURL.indexOf(keyCompare) !== -1) {
            baseURL = baseURL.replace(keyCompare, pathParams[key]);
        }
    }

    if (params) {
        baseURL = baseURL + '?' + qs.stringify(params);
    }

    return baseURL;
};

export const parseURL = (url) => {
    try {
        return new URL(url);
    } catch (error) {
        return '';
    }
};

export const getYTEmbedLinkFromYTWatchLink = (watchLink) => {
    if (!watchLink) {
        return '';
    }

    const { v } = qs.parse(parseURL(watchLink).search);
    return v ? `https://www.youtube.com/embed/${v}?autoplay=1&mute=1` : watchLink;
};

export const getYoutubeVideoID = (url) => {
    let pattern = /(youtu.*be.*)\/(watch\?v=|embed\/|v|shorts|)(.*?((?=[&#?])|$))/gm;
    return pattern.exec(url)?.[3];
};

export const formatNumber = (value, setting) => {
    if (value) {
        const decimalPosition = value.toString().indexOf('.');
        if (decimalPosition > 0) {
            const intVal = value.toString().substring(0, decimalPosition);
            const decimalVal = value.toString().substring(decimalPosition + 1);
            return `${intVal.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${decimalVal}`;
        }
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    } else if (value === 0) return 0;
    return '';
};

export const formatDateString = (dateString, formatDate = DATE_SHORT_MONTH_FORMAT) => {
    return dayjs(dateString).format(formatDate);
};

export const removeAccents = (str) => {
    if (str)
        return str
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D');
    return str;
};

export const validateUsernameForm = (rule, username) => {
    return /^[a-z0-9_]+$/.exec(username)
        ? Promise.resolve()
        : Promise.reject('Username chỉ bao gồm các ký tự a-z, 0-9, _');
};

export const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};

export const delay = (ms) => new Promise((reslove) => setTimeout(reslove, ms));

export const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

export const filterLanguage = (data, languageId = DEFAULT_LANGUAGE_ID, size = 1) => {
    let mappedArray = [];
    for (var i = 0; i < size; i++) {
        let returnItem = {};
        if (data[i]) {
            if (data[i].info)
                data[i].info.map((lang) => {
                    if (lang.languageId === languageId) returnItem = lang;
                });
            mappedArray.push(returnItem);
        } else break;
    }
    return mappedArray;
};

export const relativePosition = (element, target) => {
    if (!element || !target) return;

    const elementRect = element.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const top = elementRect.top - targetRect.top;
    const left = elementRect.left - targetRect.left;
    return { top, left };
};

// export const convertUtcToLocalTime = (utcTime, format = DATE_FORMAT_DISPLAY) => {
//     try {
//         if (utcTime) return dayjs.utc(utcTime).format(format);
//     } catch (error) {
//         return '';
//     }
// };

export const convertUtcToLocalTime = (utcTime, inputFormat = DATE_FORMAT_DISPLAY, format = DATE_FORMAT_DISPLAY) => {
    try {
        if (utcTime) {
            // console.log(moment(moment.utc(utcTime, inputFormat).toDate()).format(format));
            return moment(moment.utc(utcTime, inputFormat).toDate()).format(format);
        }
        return '';
    } catch (err) {
        return '';
    }
};

function addOrdinal(num) {
    const suffixes = [ 'th', 'st', 'nd', 'rd' ];
    const v = num % 100;
    return num + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}

export const formatDateBanner = (inputDate) => {
    const [ day, month, year ] = inputDate.split('/');

    // Thêm 'th' vào ngày và kết hợp lại
    const finalFormattedDate = addOrdinal(parseInt(day)) + ' ' + month + ', ' + year;
    console.log(month);
    return finalFormattedDate;
};

export const formatTimeDifference = (utcTime, format = DEFAULT_FORMAT) => {
    const date = convertUtcToLocalTime(utcTime, format, format);
    const givenDate = moment(date, DEFAULT_FORMAT);
    const formattedDifference = givenDate.fromNow();
    return formattedDifference;
};
export const formatCurrency = (local, style, currencyType) => {
    let currency = new Intl.NumberFormat(local, {
        style: style,
        currency: currencyType,
    });
    return currency;
};

export const formatMoney = (value, setting = {}) => {
    if (Object.keys(setting).length <= 0) {
        setting = getObjectData(KEYS.USER_DATA)?.settings?.['Money and Number'] || {};
    }
    if ((value || value === 0) && !isNaN(value)) {
        const groupSeparator = setting.groupSeparator || ',';
        const decimalSeparator = setting.decimalSeparator || '.';
        const currentcy = setting.currencySymbol || '₫';
        const currencySymbolPosition = setting.currencySymbolPosition;
        const moneyRatio = setting.moneyRatio || 1;
        const decimal = Number(setting.decimal) || 0;

        // Chia giá trị theo moneyRatio và làm tròn
        value = value / moneyRatio;

        // Thực hiện làm tròn theo yêu cầu
        value = Math.round(value);

        // Chuyển đổi thành chuỗi với định dạng mong muốn
        let valueStr = value.toString();

        // Thêm dấu phân cách nhóm
        valueStr = valueStr.replace(/\B(?=(\d{3})+(?!\d))/g, groupSeparator);

        // Trả về giá trị với ký hiệu tiền tệ
        if (currencySymbolPosition === 'FRONT') {
            return `${currentcy} ${valueStr}`;
        } else {
            return `${valueStr} ${currentcy}`;
        }
    }
    return '';
};

export function copyToClipboard(text) {
    const textField = document.createElement('textarea');
    textField.innerText = text;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
    showSucsessMessage('Sao chép mã giới thiệu thành công');
}

export function copyCourseToClipboard(text) {
    const textField = document.createElement('textarea');
    textField.innerText = text;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
    showSucsessMessage('Sao chép liên kết khóa học thành công');
}

export const convertStringToLowerCase = (str) => {
    if (str) {
        return str
            .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
            .map((x) => x.toLowerCase())
            .join(' ');
    }
    return '';
};

export function scrollToID(id, offset = 0) {
    const element = document.getElementById(id);
    const body = document.querySelector('body');
    if (element) {
        const yOffset = -offset; // Đảo dấu để thực hiện scroll theo hướng ngược lại
        const y = element.offsetTop + yOffset;
        body.scrollTo({ top: y, behavior: 'smooth' });
    }
}

export const price = (value) => {
    return formatMoney(value, {
        groupSeparator: ',',
        currencySymbol: 'đ',
        currentcyPosition: 'BACK',
        currentDecimal: '0',
    });
};

export const divideAndCheck = (value, divisor) => {
    let total;
    if (value % divisor === 0) {
        total = formatMoney(value / 1000, {
            decimalSeparator: ',',
            currencySymbol: ' N',
            currentcyPosition: 'BACK',
            decimal: '0',
        });
    } else {
        total = formatMoney(value / 1000, {
            decimalSeparator: ',',
            currencySymbol: ' N',
            currentcyPosition: 'BACK',
            decimal: '1',
        });
    }

    return total;
};

export const teachTimeTotal = (value) => {
    let total = value / 3600;
    if (total === 0) {
        total = 0;
    } else if (total < 10) {
        total = total.toFixed(2);
    } else if (total < 100) {
        total = total.toFixed(1);
    } else if (total < 1000) {
        total = total.toFixed(0);
    } else if (total < 10000) {
        total = divideAndCheck(total, 1000);
    } else if (total < 100000) {
        total = divideAndCheck(total, 1000);
    }

    return total;
};

export const grandTotal = function (arr) {
    return arr.reduce((sum, i) => {
        return sum + (i?.saleOff ? i?.price - ((i?.price * 1) / 100) * i?.saleOff : i?.price);
    }, 0);
};

export const caluculatureVoucherTotal = function (arr, voucher) {
    return arr.reduce((sum, i) => {
        if (i?.price > voucher) {
            return sum + voucher;
        } else {
            return sum + i?.price;
        }
    }, 0);
};

export const grandTotalCoupon = function (arr, coupon) {
    return arr.reduce((sum, i) => {
        const salePrice = i?.saleOff ? i?.price - ((i?.price * 1) / 100) * i?.saleOff : i?.price;
        if (salePrice > coupon) {
            const price = 0;
            return sum + (salePrice - coupon);
        } else return sum;
    }, 0);
};

export const grandBill = function (arr) {
    return arr.reduce((sum, i) => {
        return sum + i?.course?.price;
    }, 0);
};

export const realTotal = function (arr) {
    return arr.reduce((sum, i) => {
        return sum + i?.price;
    }, 0);
};

export const orgianlTotal = function (arr) {
    return arr.reduce((sum, i) => {
        return sum + i?.originalPrice;
    }, 0);
};

export const getQueryParams = (url) => {
    const queryParams = {};
    // Tạo một đối tượng URL từ chuỗi URL
    const urlObject = new URL(url);

    // Lấy tham số truy vấn từ URL
    urlObject.searchParams.forEach((value, key) => {
        queryParams[key] = value;
    });

    return queryParams;
};

/**
 * Valid input is an Array
 * @param {Any} arr
 * @return {Array}
 */
export const ensureArray = (arr, defaultValue) =>
    Array.isArray(arr) ? arr : Array.isArray(defaultValue) ? defaultValue : [];

export const convertToHoursMinutes = (seconds) => {
    const minutes = Math.ceil(seconds / 60);
    const hours = Math.floor(minutes / 60);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};
export const toHoursAndMinutes = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return { hours, minutes };
};

export function timeConvert(n) {
    var seconds = Math.floor(n % 60);
    var minutes = Math.floor((n / 60) % 60);
    var hours = Math.floor((n / (60 * 60)) % 24);

    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    return hours > 0 ? hours + ':' + minutes + ':' + seconds : minutes + ':' + seconds;
}

export function timeConvertShort(n) {
    var seconds = Math.floor(n % 60);
    var minutes = Math.floor(n / 60) % 60;
    var hours = Math.floor((n / (60 * 60)) % 24);

    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    return hours > 0 ? hours + ':' + minutes + ':' + seconds : minutes + ':' + seconds;
}

export function formatLesson(data) {
    const sections = [];
    let currentParent = null;

    data?.forEach((item) => {
        if (item.kind === LESSON_KIND_SECTION) {
            sections.push({
                ...item,
                lessons: [],
                totalStudyTime: 0,
                totalLesson: 0,
            });
            currentParent = sections[sections.length - 1];
        } else if (currentParent) {
            currentParent.lessons.push(item);
            currentParent.totalStudyTime += item.videoDuration || 0;
            currentParent.totalLesson++;
        }
    });
    return sections;
}

export const disableBrowserBack = () => {
    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener('popstate', function (event) {
        console.log('popstate');
        window.history.pushState(null, document.title, window.location.href);
    });
};

export function limitCharacters(value, numOfCharacters) {
    if (!value || typeof value !== 'string') {
        return null;
    }

    if (value?.length <= numOfCharacters) {
        return value; // Trả về chuỗi không thay đổi nếu số ký tự nhỏ hơn hoặc bằng numOfCharacters
    } else {
        return value.slice(0, numOfCharacters) + '...'; // Trả về một phần của chuỗi với số ký tự được giới hạn
    }
}

export function validateEmailPhoneInput(value) {
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value)) {
        return true;
    } else if (/^0[1-9][0-9]{8}$/.test(value)) {
        return true;
    } else {
        return false;
    }
}

export function validatePasswordInput(value) {
    if (/\s/.test(value)) {
        return false;
    }
    if (/^.{6,}$/.test(value)) {
        return true;
    }
    return false;
}

export function formatLargeNumber(number) {
    if (number >= 1000) {
        var result = number / 1000;
        var remainder = number % 1000;
        if (remainder > 0) {
            return result.toFixed(1) + 'k';
        }
        return result.toFixed(0) + 'k';
    }
    return number;
}

export const beforeUpload = (file) => {
    const maxFileSize = 2 * 1024 * 1024; // Giới hạn là 2MB
    const formatFile = [ 'png', 'jpg', 'jpeg', 'jfif' ];
    const lastDotIndex = file.name.lastIndexOf('.');

    const fileExtension = lastDotIndex !== -1 ? file.name.substring(lastDotIndex + 1) : '';
    console.log(fileExtension);
    if (!formatFile.includes(fileExtension)) {
        showErrorMessage('Sai định dạng file!');
        return false;
    }
    if (file.size > maxFileSize) {
        // Hiển thị thông báo lỗi nếu file vượt quá kích thước giới hạn
        showErrorMessage('File phải nhỏ hơn 2MB!');
        return false;
    }
    return true;
};

export const titleNotification = (item, t) => {
    const kind = item?.kind;
    const notificationMessages = {
        [notificationKind.NOTIFICATION_KIND_EXPERT_REGISTRATION]: () =>
            t.formatMessage(commonMessage.notificationExpertRegistration),

        [notificationKind.NOTIFICATION_KIND_APPROVE_EXPERT]: () =>
            t.formatMessage(commonMessage.notficationApproveExpert),

        [notificationKind.NOTIFICATION_KIND_UPDATE_SELLER]: () =>
            t.formatMessage(commonMessage.notficationUpdateSeller),

        [notificationKind.NOTIFICATION_KIND_SING_UP_STUDENT]: () =>
            t.formatMessage(commonMessage.notificationSingUpStudent),

        [notificationKind.NOTIFICATION_KIND_RECEIVE_REVENUE]: () =>
            t.formatMessage(commonMessage.notificationReviceRevenueMess, {
                revenueMoney: price(item?.revenueMoney),
                courseName: item?.courseName,
            }),

        [notificationKind.NOTIFICATION_KIND_ORDER_SUCCESS]: () =>
            t.formatMessage(commonMessage.notificationOrderSuccessMess, {
                orderId: `#${item?.bookingCode || '##'}`,
            }),

        [notificationKind.NOTIFICATION_KIND_BOOKING_REJECT]: () =>
            t.formatMessage(commonMessage.notificationOrderRejectMess, {
                orderId: `#${item?.bookingCode || '##'}`,
            }),
    };

    return notificationMessages[kind]?.() || '';
};

export const checkUserName = (_, value) => {
    if (!value) return Promise.reject('Username không được bỏ trống !');
    return Promise.resolve();
};
export const checkPassword = (_, value) => {
    if (value) {
        const passwordRegex = /^[A-Za-z\d!@#$%^&*()_+\-=]{6,}$/;
        if (!passwordRegex.test(value)) {
            return Promise.reject('Password invalid !');
        }
    } else return Promise.reject('Password invalid !');

    return Promise.resolve();
};
export const checkOtp = (_, value) => {
    if (value) {
        const otpRegex = /^[0-9_]{0,}$/;
        if (!otpRegex.test(value)) {
            return Promise.reject('Otp invalid !');
        }
    } else return Promise.reject('Otp invalid !');

    return Promise.resolve();
};

export const removePathParams = (paths) => {
    return ensureArray(paths).map((path) => {
        if (typeof path !== 'string') return path;
        return path.replaceAll(/\/:[a-zA-Z]+/g, '');
    });
};

export const validatePermission = (
    requiredPermissions = [],
    userPermissions = [],
    requiredKind,
    excludeKind = [],
    userKind,
    profile,
    path,
    separate,
) => {
    if (ensureArray(excludeKind).length > 0) {
        if (ensureArray(excludeKind).some((kind) => kind == userKind)) return false;
    }
    if (requiredKind) {
        if (requiredKind !== userKind) return false;
    }
    if (!requiredPermissions || requiredPermissions?.length == 0) return true;
    let permissionsSavePage = [];
    if (separate && requiredPermissions.length > 0) {
        permissionsSavePage.push(path?.type === 'create' ? requiredPermissions[0] : requiredPermissions[1]);
    } else {
        permissionsSavePage = requiredPermissions;
    }
    return removePathParams(permissionsSavePage).every((item) => userPermissions?.includes(item?.replace(apiUrl, '/')));
};

export const fetchCartItems = () => async (dispatch) => {
    try {
        const response = await axios.get(apiConfig.cart.getList); // Gọi API lấy giỏ hàng
        dispatch(getCartItemList(response.data.cartDetailDtos)); // Cập nhật Redux state
    } catch (error) {
        // dispatch(setError(error.message || 'Lỗi khi lấy giỏ hàng'));
        console.log(error);
    } finally {
        // dispatch(setLoading(false));
    }
};
