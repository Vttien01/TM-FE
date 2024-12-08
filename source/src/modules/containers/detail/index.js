import RenderContext from '@components/common/elements/RenderContext';
import LandingPageMobile from '@modules/layout/mobile/landing';
import React, { useEffect, useState } from 'react';
import useFetch from '@hooks/useFetch';
import apiConfig from '@constants/apiConfig';
import useAppLoading from '@hooks/useAppLoading';
import { selectCategoryCourseFree, selectCategoryCourseList, selectCategoryCourseNew, selectCategoryCourseTop, selectExpertList, selectGetFeStatistic, selectGetHomePage, selectNewsData, selectReviewData, selectSlideshow } from '@selectors/app';
import { useDispatch, useSelector } from 'react-redux';
import { STATUS_ACTIVE, categoryKinds, reviewKind } from '@constants';
import { appActions } from '@store/actions';
import DetailPageDesktop from '@modules/layout/desktop/detail';
const DetailPageContainer = () => {

    // const dispatch = useDispatch();
    // useEffect(() => {
    //     dispatch(appActions.setListCategoryCourse({}));
    //     dispatch(appActions.setExpertList({}));
    // }, []);
    return (
        <RenderContext
            components={{
                desktop: {
                    defaultTheme: DetailPageDesktop,
                },
                mobile: {
                    defaultTheme: LandingPageMobile,
                },
            }}
        />
    );
};

export default DetailPageContainer;
