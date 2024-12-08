import { createSelector } from 'reselect';

export const selectAppLoading = createSelector(
    (state) => state.app.appLoading,
    (appLoading) => appLoading > 0,
);

export const selectActionLoading = (type) =>
    createSelector(
        (state) => state.app[type],
        (loading) => loading,
    );

export const selectAppTheme = createSelector(
    (state) => state.app.theme,
    (theme) => theme,
);

export const selectAppLocale = createSelector(
    (state) => state.app.locale,
    (locale) => locale,
);

export const selectHeaderType = createSelector(
    (state) => state.app.headerDefault,
    (headerDefault) => headerDefault,
);

export const selectHeaderTypePreview = createSelector(
    (state) => state.app.headerDefaultPreview,
    (headerDefaultPreview) => headerDefaultPreview,
);

export const selectedNotificationSelector = createSelector(
    (state) => state.app.notification,
    (notification) => notification,
);
export const selectSlideshow = createSelector(
    (state) => state.app.slideShow,
    (slideShow) => slideShow,
);
export const selectGetHomePage = createSelector(
    (state) => state.app.homePage,
    (homePage) => homePage,
);

export const selectCategoryCourseFree = createSelector(
    (state) => state.app.categoryCourseFree,
    (categoryCourseFree) => categoryCourseFree,
);

export const selectCategoryCourseTop = createSelector(
    (state) => state.app.categoryCourseTop,
    (categoryCourseTop) => categoryCourseTop,
);

export const selectReviewData = createSelector(
    (state) => state.app.reviewData,
    (reviewData) => reviewData,
);

export const selectCategoryCourseNew = createSelector(
    (state) => state.app.categoryCourseNew,
    (categoryCourseNew) => categoryCourseNew,
);

export const selectNewsData = createSelector(
    (state) => state.app.newsData,
    (newsData) => newsData,
);

export const selectExpertList = createSelector(
    (state) => state.app.expertList,
    (expertList) => expertList,
);

export const selectGetFeStatistic = createSelector(
    (state) => state.app.getFeStatistic,
    (getFeStatistic) => getFeStatistic,
);

export const selectCategoryCourseList = createSelector(
    (state) => state.app.categoryCourseList,
    (categoryCourseList) => categoryCourseList,
);

export const selectAppListSearchs = createSelector(
    (state) => state.app.listSearch,
    (listSearch) => listSearch,
);

export const selectAppListCategories = createSelector(
    (state) => state.app.listCategory,
    (listCategory) => listCategory,
);

export const selectAppListCategory = createSelector(
    (state) => state.app.listCategory,
    (listCategory) => listCategory,
);
export const selectAppListExpert = createSelector(
    (state) => state.app.listExpert,
    (listExpert) => listExpert,
);

export const selectAppLoginModal = createSelector(
    (state) => state.app.listExpert,
    (listExpert) => listExpert,
);
export const selectAppFreeCourse = createSelector(
    (state) => state.app.setFreeCourse,
    (freeCourse) => freeCourse,
);
export const selectAppListNews = createSelector(
    (state) => state.app.listNews,
    (listNews) => listNews,
);
export const selectAppListReview = createSelector(
    (state) => state.app.listReview,
    (listReview) => listReview,
);

export const selectCategory = createSelector(
    (state) => state.app.category,
    (category) => category,
);
