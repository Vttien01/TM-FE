import RenderContext from '@components/common/elements/RenderContext';
import LandingPageDesktop from '@modules/layout/desktop/landing';
import LandingPageMobile from '@modules/layout/mobile/landing';
import React, { useEffect, useState } from 'react';
import useFetch from '@hooks/useFetch';
import apiConfig from '@constants/apiConfig';
import useAppLoading from '@hooks/useAppLoading';
import {
    selectCategoryCourseFree,
    selectCategoryCourseList,
    selectCategoryCourseNew,
    selectCategoryCourseTop,
    selectExpertList,
    selectGetFeStatistic,
    selectGetHomePage,
    selectNewsData,
    selectReviewData,
    selectSlideshow,
} from '@selectors/app';
import { useDispatch, useSelector } from 'react-redux';
import { STATUS_ACTIVE, categoryKinds, reviewKind } from '@constants';
import { appActions } from '@store/actions';
const LandingPageContainer = () => {
    // const { data } = useFetch(apiConfig.news.getList, { immediate: true, mappingData: (res) => res.data.data });
    // const { data: slideShowData, loading: slideShowDataLoading } = useFetch(apiConfig.slideShow.getList, {
    //     immediate: true,
    //     mappingData: (res) => res?.data?.content,
    // });

    // const { data: expertList, execute: expertExecute } = useFetch(apiConfig.expert.getClientList, {
    //     params: { isOutstanding: true },
    //     immediate: true,
    //     mappingData: (res) => res?.data?.content,
    // });

    // const { data: categoryCourseList, execute: categoryCourseExecute } = useFetch(apiConfig.categoryHome.getListClient, {
    //     immediate: true,
    //     params: { kind: categoryKinds.CATEGORY_KIND_NEWS, status: STATUS_ACTIVE },
    //     mappingData: (res) => res?.data?.content,
    // });

    // const slideShowData = useSelector(selectSlideshow);

    // const categoryCourseFree = useSelector(selectCategoryCourseFree);
    // const categoryCourseTop = useSelector(selectCategoryCourseTop);
    // const categoryCourseNew = useSelector(selectCategoryCourseNew);
    // const newsData = useSelector(selectNewsData);
    // const getFeStatistic = useSelector(selectGetFeStatistic);
    // const reviewData = useSelector(selectReviewData);
    // const expertList = useSelector(selectExpertList);
    // const categoryCourseList = useSelector(selectCategoryCourseList);

    // const dispatch = useDispatch();
    // useEffect(() => {
    //     dispatch(appActions.setListCategoryCourse({}));
    //     dispatch(appActions.setExpertList({}));
    // }, []);
    return (
        <RenderContext
            components={{
                desktop: {
                    defaultTheme: LandingPageDesktop,
                },
                mobile: {
                    defaultTheme: LandingPageMobile,
                },
            }}
            // slideShowData={slideShowData || []}
            // expertList={expertList || []}
            // categoryCourseList={categoryCourseList}
            // categoryCourseFree={categoryCourseFree}
            // categoryCourseTop={[ categoryCourseTop ]}
            // categoryCourseNew={categoryCourseNew}
            // reviewData={reviewData}
            // newsData={newsData}
            // statistical={getFeStatistic}
        />
    );
};

export default LandingPageContainer;
