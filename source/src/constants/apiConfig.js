import { create } from 'yup/lib/Reference';
import { AppConstants, apiUrl } from '.';

const baseHeader = {
    'Content-Type': 'application/json',
};

const multipartFormHeader = {
    'Content-Type': 'multipart/form-data',
};
const apiConfig = {
    file: {
        upload: {
            baseURL: `${AppConstants.mediaRootUrl}v1/file/upload`,
            method: 'POST',
            headers: multipartFormHeader,
        },
    },
    account: {
        loginBasic: {
            baseURL: `${apiUrl}api/token`,
            method: 'POST',
            headers: baseHeader,
        },
        loginSSO: {
            baseURL: `${apiUrl}sso/login`,
            method: 'POST',
            headers: baseHeader,
        },
        login: {
            baseURL: `${apiUrl}v1/account/login`,
            method: 'POST',
            headers: baseHeader,
        },
        logout: {
            baseURL: `${apiUrl}v1/account/logout`,
            method: 'GET',
            headers: baseHeader,
        },
        getProfile: {
            baseURL: `${apiUrl}v1/account/profile`,
            method: 'GET',
            headers: baseHeader,
        },
        getSellerProfile: {
            baseURL: `${apiUrl}v1/seller/profile`,
            method: 'GET',
            headers: baseHeader,
        },
        getExpertProfile: {
            baseURL: `${apiUrl}v1/expert/get-profile`,
            method: 'GET',
            headers: baseHeader,
        },
        register: {
            baseURL: `${apiUrl}v1/customer/register`,
            method: 'POST',
            headers: baseHeader,
        },
        updateProfile: {
            baseURL: `${apiUrl}v1/account/update_admin`,
            method: 'PUT',
            headers: baseHeader,
        },
        getById: {
            baseURL: `${apiUrl}v1/account/get/:id`,
            method: 'GET',
            headers: baseHeader,
        },
        resquestForgetPassword: {
            baseURL: `${apiUrl}v1/account/request_forget_password`,
            method: 'POST',
            headers: baseHeader,
        },
        forgetPassword: {
            baseURL: `${apiUrl}v1/account/forget_password`,
            method: 'POST',
            headers: baseHeader,
        },
    },
    news: {
        getList: {
            baseURL: `${apiUrl}v1/news/list_news`,
            method: 'GET',
            headers: baseHeader,
        },
        getById: {
            baseURL: `${apiUrl}v1/news/get_news/:id`,
            method: 'GET',
            headers: baseHeader,
        },
        clientNews: {
            baseURL: `${apiUrl}v1/news/client-list`,
            method: 'GET',
            headers: baseHeader,
        },
        clientNewsGet: {
            baseURL: `${apiUrl}v1/news/client-get/:id`,
            method: 'GET',
            headers: baseHeader,
        },
    },
    category: {
        autocomplete: {
            baseURL: `${apiUrl}v1/category/auto-complete`,
            method: 'GET',
            headers: baseHeader,
        },
        getById: {
            baseURL: `${apiUrl}v1/category/get/:id`,
            method: 'GET',
            headers: baseHeader,
        },
    },
    expert: {
        getList: {
            baseURL: `${apiUrl}v1/expert/list`,
            method: 'GET',
            headers: baseHeader,
        },
        getClientList: {
            baseURL: `${apiUrl}v1/expert/client-list`,
            method: 'GET',
            headers: baseHeader,
        },
        getById: {
            baseURL: `${apiUrl}v1/expert/get/:id`,
            method: 'GET',
            headers: baseHeader,
        },
        getClientById: {
            baseURL: `${apiUrl}v1/expert/client-get/:id`,
            method: 'GET',
            headers: baseHeader,
        },
        signUp: {
            baseURL: `${apiUrl}v1/expert/signup`,
            method: 'POST',
            headers: baseHeader,
        },
        update: {
            baseURL: `${apiUrl}v1/expert/update`,
            method: 'PUT',
            headers: baseHeader,
        },
        delete: {
            baseURL: `${apiUrl}v1/expert/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
        },
        autocomplete: {
            baseURL: `${apiUrl}v1/expert/auto-complete`,
            method: 'GET',
            headers: baseHeader,
        },
        getProfile: {
            baseURL: `${apiUrl}v1/expert/get-profile`,
            method: 'GET',
            headers: baseHeader,
        },
        updateProfile: {
            baseURL: `${apiUrl}v1/expert/update-profile`,
            method: 'PUT',
            headers: baseHeader,
        },
    },
    student: {
        getList: {
            baseURL: `${apiUrl}v1/student/list`,
            method: 'GET',
            headers: baseHeader,
        },
        getById: {
            baseURL: `${apiUrl}v1/student/get/:id`,
            method: 'GET',
            headers: baseHeader,
        },
        signUp: {
            baseURL: `${apiUrl}v1/student/signup`,
            method: 'POST',
            headers: baseHeader,
        },
        update: {
            baseURL: `${apiUrl}v1/student/update`,
            method: 'PUT',
            headers: baseHeader,
        },
        delete: {
            baseURL: `${apiUrl}v1/student/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
        },
        autocomplete: {
            baseURL: `${apiUrl}v1/student/auto-complete`,
            method: 'GET',
            headers: baseHeader,
        },
        getProfile: {
            baseURL: `${apiUrl}v1/student/profile`,
            method: 'GET',
            headers: baseHeader,
        },
        updateProfile: {
            baseURL: `${apiUrl}v1/student/update-profile`,
            method: 'PUT',
            headers: baseHeader,
        },
        upgradeProfile: {
            baseURL: `${apiUrl}v1/student/upgrade-seller`,
            method: 'PUT',
            headers: baseHeader,
        },
        myCourse: {
            baseURL: `${apiUrl}v1/student/my-course`,
            method: 'GET',
            headers: baseHeader,
        },
    },
    seller: {
        getList: {
            baseURL: `${apiUrl}v1/seller/list`,
            method: 'GET',
            headers: baseHeader,
        },
        getById: {
            baseURL: `${apiUrl}v1/seller/get/:id`,
            method: 'GET',
            headers: baseHeader,
        },
        update: {
            baseURL: `${apiUrl}v1/seller/update`,
            method: 'PUT',
            headers: baseHeader,
        },
        delete: {
            baseURL: `${apiUrl}v1/seller/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
        },
        autocomplete: {
            baseURL: `${apiUrl}v1/seller/auto-complete`,
            method: 'GET',
            headers: baseHeader,
        },
        updateProfile: {
            baseURL: `${apiUrl}v1/seller/update-profile`,
            method: 'PUT',
            headers: baseHeader,
        },
        checkCoupon: {
            baseURL: `${apiUrl}v1/seller/check-coupon`,
            method: 'POST',
            headers: baseHeader,
        },
    },
    nation: {
        getList: {
            baseURL: `${apiUrl}v1/nation/list`,
            method: 'GET',
            headers: baseHeader,
        },
        getById: {
            baseURL: `${apiUrl}v1/nation/get/:id`,
            method: 'GET',
            headers: baseHeader,
        },
        create: {
            baseURL: `${apiUrl}v1/nation/create`,
            method: 'POST',
            headers: baseHeader,
        },
        update: {
            baseURL: `${apiUrl}v1/nation/update`,
            method: 'PUT',
            headers: baseHeader,
        },
        delete: {
            baseURL: `${apiUrl}v1/nation/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
        },
        autocomplete: {
            baseURL: `${apiUrl}v1/nation/auto-complete`,
            method: 'GET',
            headers: baseHeader,
        },
    },
    notification: {
        getList: {
            baseURL: `${apiUrl}v1/notification/list`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        getById: {
            baseURL: `${apiUrl}v1/notification/get/:id`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        create: {
            baseURL: `${apiUrl}v1/notification/create`,
            method: 'POST',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        update: {
            baseURL: `${apiUrl}v1/notification/update`,
            method: 'PUT',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        delete: {
            baseURL: `${apiUrl}v1/notification/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        autocomplete: {
            baseURL: `${apiUrl}v1/notification/auto-complete`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        myNotification: {
            baseURL: `${apiUrl}v1/notification/my-notification`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        changeState: {
            baseURL: `${apiUrl}v1/notification/change-state`,
            method: 'PUT',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        readAll: {
            baseURL: `${apiUrl}v1/notification/read-all`,
            method: 'PUT',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        deleteAll: {
            baseURL: `${apiUrl}v1/notification/delete-all`,
            method: 'DELETE',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
    },

    expertRegistration: {
        create: {
            baseURL: `${apiUrl}v1/expert-registration/registration`,
            method: 'POST',
            headers: baseHeader,
        },
    },

    slideShow: {
        getList: {
            baseURL: `${apiUrl}v1/slideshow/list`,
            method: 'GET',
            headers: baseHeader,
        },
    },
    course: {
        getList: {
            baseURL: `${apiUrl}v1/course/list`,
            method: 'GET',
            headers: baseHeader,
        },
        getClientList: {
            baseURL: `${apiUrl}v1/course/client-list`,
            method: 'GET',
            headers: baseHeader,
        },
        getById: {
            baseURL: `${apiUrl}v1/course/get/:id`,
            method: 'GET',
            headers: baseHeader,
        },
        getDetail: {
            baseURL: `${apiUrl}v1/course/course-detail/:id`,
            method: 'GET',
            headers: baseHeader,
        },
        update: {
            baseURL: `${apiUrl}v1/course/update`,
            method: 'PUT',
            headers: baseHeader,
        },
        delete: {
            baseURL: `${apiUrl}v1/course/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
        },
        autocomplete: {
            baseURL: `${apiUrl}v1/course/auto-complete`,
            method: 'GET',
            headers: baseHeader,
        },
        create: {
            baseURL: `${apiUrl}v1/course/create`,
            method: 'POST',
            headers: baseHeader,
        },
    },

    categoryHome: {
        getListClient: {
            baseURL: `${apiUrl}v1/category-home/client-list`,
            method: 'GET',
            headers: baseHeader,
        },
    },
    booking: {
        getList: {
            baseURL: `${apiUrl}v1/booking/list`,
            method: 'GET',
            headers: baseHeader,
        },
        getById: {
            baseURL: `${apiUrl}v1/booking/get/:id`,
            method: 'GET',
            headers: baseHeader,
        },
        create: {
            baseURL: `${apiUrl}v1/booking/create`,
            method: 'POST',
            headers: baseHeader,
        },
        update: {
            baseURL: `${apiUrl}v1/booking/update`,
            method: 'PUT',
            headers: baseHeader,
        },
        delete: {
            baseURL: `${apiUrl}v1/booking/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
        },
        autocomplete: {
            baseURL: `${apiUrl}v1/booking/auto-complete`,
            method: 'GET',
            headers: baseHeader,
        },
        buyFreeCourse: {
            baseURL: `${apiUrl}v1/booking/buy-free-course`,
            method: 'POST',
            headers: baseHeader,
        },
        buyCourseDirect: {
            baseURL: `${apiUrl}v1/booking/buy-direct`,
            method: 'POST',
            headers: baseHeader,
        },
        paymentInfo: {
            baseURL: `${apiUrl}v1/booking/client-get/:id`,
            method: 'GET',
            headers: baseHeader,
        },
    },
    promotion: {
        getList: {
            baseURL: `${apiUrl}v1/promotion/list`,
            method: 'GET',
            headers: baseHeader,
        },
        getById: {
            baseURL: `${apiUrl}v1/promotion/get/:id`,
            method: 'GET',
            headers: baseHeader,
        },
        create: {
            baseURL: `${apiUrl}v1/promotion/create`,
            method: 'POST',
            headers: baseHeader,
        },
        update: {
            baseURL: `${apiUrl}v1/promotion/update`,
            method: 'PUT',
            headers: baseHeader,
        },
        delete: {
            baseURL: `${apiUrl}v1/promotion/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
        },
        autocomplete: {
            baseURL: `${apiUrl}v1/promotion/auto-complete`,
            method: 'GET',
            headers: baseHeader,
        },
    },
    cartItem: {
        create: {
            baseURL: `${apiUrl}v1/cart-item/create`,
            method: 'POST',
            headers: baseHeader,
        },
        getList: {
            baseURL: `${apiUrl}v1/cart-item/list`,
            method: 'GET',
            headers: baseHeader,
        },
        createList: {
            baseURL: `${apiUrl}v1/cart-item/create-list`,
            method: 'POST',
            headers: baseHeader,
        },
        delete: {
            baseURL: `${apiUrl}v1/cart-item/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
        },
        deleteAll: {
            baseURL: `${apiUrl}v1/cart-item/delete-all`,
            method: 'DELETE',
            headers: baseHeader,
        },
    },
    courseRetail: {
        registerRetail: {
            baseURL: `${apiUrl}v1/course-retail/register-retail`,
            method: 'POST',
            headers: baseHeader,
        },
    },
    review: {
        getByProductPublic: {
            baseURL: `${apiUrl}v1/review/get-by-product-public`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },

        getByProduct: {
            baseURL: `${apiUrl}v1/review/get-by-product`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        create: {
            baseURL: `${apiUrl}v1/review/create`,
            method: 'POST',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        update: {
            baseURL: `${apiUrl}v1/review/update`,
            method: 'PUT',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        delete: {
            baseURL: `${apiUrl}v1/review/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
            isRequiredTenantId: true,
        },

        getMyReview: {
            baseURL: `${apiUrl}v1/review/get-my-review`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },

        getUnratedProduct: {
            baseURL: `${apiUrl}v1/review/get-unrated-product`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },

        avgStarReviews: {
            baseURL: `${apiUrl}v1/review/star/:productId`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },

        starListReview: {
            baseURL: `${apiUrl}v1/review/star/:id`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        starCountForEach: {
            baseURL: `${apiUrl}v1/review/star/count-for-each/:id`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
    },
    settings: {
        getList: {
            baseURL: `${apiUrl}v1/settings/list`,
            method: 'GET',
            headers: baseHeader,
        },
        getById: {
            baseURL: `${apiUrl}v1/settings/get/:id`,
            method: 'GET',
            headers: baseHeader,
        },
        create: {
            baseURL: `${apiUrl}v1/settings/create`,
            method: 'POST',
            headers: baseHeader,
        },
        update: {
            baseURL: `${apiUrl}v1/settings/update`,
            method: 'PUT',
            headers: baseHeader,
        },
        delete: {
            baseURL: `${apiUrl}v1/settings/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
        },
        autocomplete: {
            baseURL: `${apiUrl}v1/settings/auto-complete`,
            method: 'GET',
            headers: baseHeader,
        },
    },
    product: {
        getList: {
            baseURL: `${apiUrl}v1/product/list`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        getListRelated: {
            baseURL: `${apiUrl}v1/product/get-product-related/:id`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        getById: {
            baseURL: `${apiUrl}v1/product/get/:id`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        create: {
            baseURL: `${apiUrl}v1/product/create`,
            method: 'POST',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        update: {
            baseURL: `${apiUrl}v1/product/update`,
            method: 'PUT',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        delete: {
            baseURL: `${apiUrl}v1/product/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        autocomplete: {
            baseURL: `${apiUrl}v1/product/auto-complete`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        top10BestSelling: {
            baseURL: `${apiUrl}v1/product/get-product-top10`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        getProductAutocomplete: {
            baseURL: `${apiUrl}v1/product/get-autoComplete/:id`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
    },
    order: {
        getList: {
            baseURL: `${apiUrl}v1/order/list`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        getById: {
            baseURL: `${apiUrl}v1/order/get/:id`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        create: {
            baseURL: `${apiUrl}v1/order/create`,
            method: 'POST',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        createForUser: {
            baseURL: `${apiUrl}v1/order/create-for-user`,
            method: 'POST',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        update: {
            baseURL: `${apiUrl}v1/order/update`,
            method: 'PUT',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        updateMyOrder: {
            baseURL: `${apiUrl}v1/order/update-my-order`,
            method: 'PUT',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        cancelMyOrder: {
            baseURL: `${apiUrl}v1/order/cancel-my-order`,
            method: 'PUT',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        myOrder: {
            baseURL: `${apiUrl}v1/order/my-order`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        getOrderPhone: {
            baseURL: `${apiUrl}v1/order/get-order-phone`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
    },
    cart: {
        getList: {
            baseURL: `${apiUrl}v1/cart/get-my-cart`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        create: {
            baseURL: `${apiUrl}v1/cart/add-product-into-cart`,
            method: 'POST',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        update: {
            baseURL: `${apiUrl}v1/cart/update`,
            method: 'PUT',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        updateItemCart: {
            baseURL: `${apiUrl}v1/cart/update-item-inCart`,
            method: 'PUT',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        delete: {
            baseURL: `${apiUrl}v1/cart/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
    },
    transaction: {
        cancelPay: {
            baseURL: `${apiUrl}v1/transaction/deposit/cancel`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },

        successPay: {
            baseURL: `${apiUrl}v1/transaction/deposit/success`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        create: {
            baseURL: `${apiUrl}v1/transaction/create`,
            method: 'POST',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        vnpay: {
            baseURL: `${apiUrl}v1/transaction/vn-pay`,
            method: 'POST',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
    },
    orderDetail: {
        getByOrder: {
            baseURL: `${apiUrl}v1/order-detail/get-by-order/:id`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },

        getByPhoneAndOrder: {
            baseURL: `${apiUrl}v1/order-detail/get-by-orderCode`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
    },
    address: {
        autocomplete: {
            baseURL: `${apiUrl}v1/address/auto-complete`,
            method: 'GET',
            headers: baseHeader,
        },
        getList: {
            baseURL: `${apiUrl}v1/address/list`,
            method: 'GET',
            headers: baseHeader,
        },
        getById: {
            baseURL: `${apiUrl}v1/address/get/:id`,
            method: 'GET',
            headers: baseHeader,
        },
        create: {
            baseURL: `${apiUrl}v1/address/create`,
            method: 'POST',
            headers: baseHeader,
        },
        update: {
            baseURL: `${apiUrl}v1/address/update`,
            method: 'PUT',
            headers: baseHeader,
        },
        delete: {
            baseURL: `${apiUrl}v1/address/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
        },
        getMyAddress: {
            baseURL: `${apiUrl}v1/address/get-myAddress`,
            method: 'GET',
            headers: baseHeader,
        },
    },
    brand: {
        getList: {
            baseURL: `${apiUrl}v1/brand/list`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        getById: {
            baseURL: `${apiUrl}v1/brand/get/:id`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        create: {
            baseURL: `${apiUrl}v1/brand/create`,
            method: 'POST',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        update: {
            baseURL: `${apiUrl}v1/brand/update`,
            method: 'PUT',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        delete: {
            baseURL: `${apiUrl}v1/brand/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        autocomplete: {
            baseURL: `${apiUrl}v1/brand/auto-complete`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
    },
    user: {
        getList: {
            baseURL: `${apiUrl}v1/user/list`,
            method: `GET`,
            headers: baseHeader,
        },
        getById: {
            baseURL: `${apiUrl}v1/user/get/:id`,
            method: `GET`,
            headers: baseHeader,
        },
        create: {
            baseURL: `${apiUrl}v1/user/signup`,
            method: `POST`,
            headers: baseHeader,
        },

        confirmOtp: {
            baseURL: `${apiUrl}v1/user/confirm_otp`,
            method: `POST`,
            headers: baseHeader,
        },
        requestSendMail: {
            baseURL: `${apiUrl}v1/user/request-send-mail`,
            method: `POST`,
            headers: baseHeader,
        },
        update: {
            baseURL: `${apiUrl}v1/user/update-profile`,
            method: `PUT`,
            headers: baseHeader,
        },
        updateProfile: {
            baseURL: `${apiUrl}v1/user/update-profile`,
            method: `PUT`,
            headers: baseHeader,
        },
        delete: {
            baseURL: `${apiUrl}v1/user/delete/:id`,
            method: `DELETE`,
            headers: baseHeader,
        },
        autocomplete: {
            baseURL: `${apiUrl}v1/user/auto-complete`,
            method: `GET`,
            headers: baseHeader,
        },
        getProfile: {
            baseURL: `${apiUrl}v1/user/get-myprofile`,
            method: `GET`,
            headers: baseHeader,
        },
        changePassword: {
            baseURL: `${apiUrl}v1/user/update-my-pass-word`,
            method: `PUT`,
            headers: baseHeader,
        },
    },
    voucher: {
        getList: {
            baseURL: `${apiUrl}v1/voucher/list`,
            method: `GET`,
            headers: baseHeader,
        },
        getMyVoucher: {
            baseURL: `${apiUrl}v1/voucher/get-my-voucher`,
            method: `GET`,
            headers: baseHeader,
        },
        getGuestVoucher: {
            baseURL: `${apiUrl}v1/voucher/get-voucher-for-guest`,
            method: `GET`,
            headers: baseHeader,
        },
    },
};

export default apiConfig;
