import { createReducer } from '@store/utils';
import { appActions } from '@store/actions';
import { defaultLocale } from '@constants';
import { getData } from '@utils/localStorage';
import { storageKeys } from '@constants';
import { categoryCourseList, categoryCourseNew, changeHeaderPreview, expertList, getFeStatistic, newsData, reviewData, setBuyCourseDirect, setCategory, setFreeCourse,setListNews, setListReview, setPayment } from '@store/actions/app';

import { setListSearch } from '@store/actions/app';
import { setListCategory } from '@store/actions/app';
const {
    hideAppLoading,
    showAppLoading,
    toggleActionLoading,
    changeLanguage,
    showAppCartModal,
    hideAppCartModal,
    changeHeader,
    setNotification,
    getSlideshow,
    getHomePage,
    categoryCourseFree,
    categoryCourseTop,
    setListCategoryCourse,
    setExpertList,
    showAppLoginModal,
    hideAppLoginModal,
} = appActions;

const initialState = {
    appLoading: 0,
    locale: defaultLocale,
    siteInfo: null,
    cartModal: false,
    cartProduct: {},
    notification: null,
    listSearch: {},
    listCategory: {},
    listExpert:{},
    freeCourse : {},
    headerDefault: true,
    loginModal : false,
    buyCourseDirect : false,
    payment : false,
};

const appReducer = createReducer(
    {
        reducerName: 'app',
        initialState,
        storage: {
            whiteList: [ 'theme', 'locale', 'cart' ],
        },
    },
    {
        [showAppLoading.type]: (state) => {
            state.appLoading++;
        },
        [hideAppLoading.type]: (state) => {
            state.appLoading = Math.max(0, state.appLoading - 1);
        },
        [toggleActionLoading.type]: (state, action) => {
            if (action.payload.isLoading) {
                state[action.payload.type] = true;
            } else {
                delete state[action.payload.type];
            }
        },
        [changeLanguage.type]: (state, { payload }) => {
            state.locale = payload;
        },
        [showAppCartModal.type]: (state, { product }) => {
            state.cartModal = true;
            state.cartProduct = product;
        },
        [hideAppCartModal.type]: (state) => {
            state.cartModal = false;
            state.cartProduct = {};
        },
        [changeHeader.type]: (state, { payload }) => {
            state.headerDefault = payload;
        },
        [changeHeaderPreview.type]: (state, { payload }) => {
            state.headerDefaultPreview = payload;
        },
        [setNotification.type]: (state, { payload }) => {
            state.notification = payload || null;
        },
        [getSlideshow.type]: (state, { payload }) => {
            state.slideShow = payload;
        },
        [getHomePage.type]: (state, { payload }) => {
            state.homePage = payload;
        },
        [categoryCourseFree.type]: (state, { payload }) => {
            state.categoryCourseFree = payload;
        },
        [categoryCourseTop.type]: (state, { payload }) => {
            state.categoryCourseTop = payload;
        },
        [reviewData.type]: (state, { payload }) => {
            state.reviewData = payload;
        },
        [categoryCourseNew.type]: (state, { payload }) => {
            state.categoryCourseNew = payload;
        },
        [newsData.type]: (state, { payload }) => {
            state.newsData = payload;
        },
        [expertList.type]: (state, { payload }) => {
            state.expertList = payload;
        },
        [getFeStatistic.type]: (state, { payload }) => {
            state.getFeStatistic = payload;
        },
        [categoryCourseList.type]: (state, { payload }) => {
            state.categoryCourseList = payload;
        },
        [setListSearch.type]: (state, { payload }) => {
            state.listSearch = payload || {};
        },
        [setListCategory.type]: (state, { payload }) => {
            state.listCategory = payload?.data || {};
        },
        [setListCategoryCourse.type]: (state, { payload }) => {
            state.listCategory = payload || {};
        },
        [setExpertList.type]: (state, { payload }) => {
            state.listExpert = payload || {};
        },
        [showAppLoginModal.type]: (state) => {
            state.loginModal = true;

        },
        [hideAppLoginModal.type]: (state) => {
            state.loginModal = false;

        },
        [setFreeCourse.type]: (state, { payload }) => {
            state.freeCourse = payload || {};
        },
        [setListNews.type]: (state, { payload }) => {
            state.listNews = payload || {};
        },

        [setBuyCourseDirect.type]: (state, { payload }) => {
            state.buyCourseDirect = payload;
        },
        [setListReview.type]: (state, { payload }) => {
            state.listReview = payload || {};
        },
        [setPayment.type]: (state, { payload }) => {
            state.payment = payload ;
        },
        [setCategory.type]: (state, { payload }) => {
            state.category = payload ;
        },
    },

);

export default appReducer;
