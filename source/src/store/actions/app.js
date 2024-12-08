import { createAction } from '@store/utils';

export const showAppLoading = createAction('app/SHOW_LOADING');
export const hideAppLoading = createAction('app/HIDE_LOADING');
export const toggleActionLoading = createAction('app/ACTION_LOADING');
export const changeLanguage = createAction('app/CHANGE_LANGUAGE');
export const uploadFile = createAction('app/UPLOAD_FILE');
export const changeHeader = createAction('app/CHANGE_HEADER');
export const changeHeaderPreview = createAction('app/CHANGE_HEADER_PREVIEW');
export const showAppCartModal = createAction('app/SHOW_CART_MODAL');
export const hideAppCartModal = createAction('app/HIDE_CART_MODAL');
export const setNotification = createAction('app/SET_NOTIFICATION');

export const getSlideshow = createAction('app/GET_SLIDE_SHOW');
export const getHomePage = createAction('app/GET_HOME_PAGE');
export const categoryCourseTop = createAction('app/GET_COURSE_TOP');
export const categoryCourseFree = createAction('app/GET_COURSE_FREE');
export const reviewData = createAction('app/GET_REVIEW_DATA');
export const categoryCourseNew = createAction('app/GET_COURSE_NEW');
export const newsData = createAction('app/GET_NEWS_DATA');
export const getFeStatistic = createAction('app/GET_FE_STATISTIC');
export const expertList = createAction('app/GET_EXPERT_LIST');
export const categoryCourseList = createAction('app/GET_COURSE_LIST');

export const setListSearch = createAction('app/SET_LIST_SEARCH');
export const setListCategory = createAction('app/SET_LIST_CATEGORY');

export const setListCategoryCourse = createAction('app/SET_LIST_CATEGORY_COURSE');
export const setExpertList = createAction('app/SET_EXPERT_LIST');

export const showAppLoginModal = createAction('app/SHOW_LOGIN_MODAL');
export const hideAppLoginModal = createAction('app/HIDE_LOGIN_MODAL');
export const setFreeCourse = createAction('app/SET_FREE_COURSE');
export const setListNews = createAction('app/SET_LIST_NEWS');
export const setBuyCourseDirect = createAction('app/SET_BUY_COURSE_DIRECT');
export const setListReview = createAction('app/SET_LIST_REVIEW');
export const setPayment = createAction('app/SET_PAYMENT');
export const setCategory = createAction('app/SET_CATEGORY');
export const actions = {
    showAppLoading,
    hideAppLoading,
    toggleActionLoading,
    changeLanguage,
    uploadFile,
    showAppCartModal,
    hideAppCartModal,
    changeHeader,
    setNotification,
    getSlideshow,
    getHomePage,
    categoryCourseTop,
    categoryCourseFree,
    reviewData,
    categoryCourseNew,
    newsData,
    getFeStatistic,
    expertList,
    categoryCourseList,
    setListSearch,
    setListCategory,
    setListCategoryCourse,
    setExpertList,
    showAppLoginModal,
    hideAppLoginModal,
    setFreeCourse,
    setListNews,
    setBuyCourseDirect,
    setListReview,
    setPayment,
    changeHeaderPreview,
    setCategory,
};
