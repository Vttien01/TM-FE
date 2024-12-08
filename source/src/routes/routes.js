import React, { useEffect } from 'react';

import { Routes, BrowserRouter, Route, useLocation } from 'react-router-dom';

import ValidateAccess from './ValidateAccess';

import routes from '.';
import useAuth from '@hooks/useAuth';
import Loading from '@components/common/loading';
import PageNotFound from '@components/common/page/PageNotFound';
import AppNavigate from '@modules/layout/common/AppNavigate';
// import { webSocket } from '@utils/webSocket';
import { getCacheAccessToken } from '@services/userService';
import useTranslate from '@hooks/useTranslate';
import { useDispatch } from 'react-redux';
import { appActions, cartActions } from '@store/actions';
import useFetch from '@hooks/useFetch';
import apiConfig from '@constants/apiConfig';
import useShoppingCart from '@hooks/useShoppingCart';
import InitRoute from './InitRoute';
import { AppConstants, DEFAULT_PAGE_SIZE, STATUS_ACTIVE, categoryKinds, reviewKind } from '@constants';
const routesArray = Object.values(routes);

const AppRoutes = () => {
    const { isAuthenticated, loading: loadingProfile, profile } = useAuth();
    const translate = useTranslate();
    const dispatch = useDispatch();
    // const { data: slideShow, execute: executeSlideshow } = useFetch(apiConfig.slideShow.getList, {
    //     immediate: true,
    //     mappingData: (res) => res.data.content,
    //     params: {
    //         status: 1,
    //     },
    // });

    // useEffect(() => {
    //     if (slideShow) {
    //         dispatch(appActions.getSlideshow(slideShow));
    //     }
    // }, [ slideShow ]);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             // Sử dụng Promise.all để chờ cho cả hai promise hoàn thành
    //             await Promise.all([
    //                 courseFreeExecute(),
    //                 categoryCourseTopExecute(),
    //                 categoryCourseNewExecute(),
    //                 reviewDataExecute(),
    //                 expertExecute(),
    //                 newsDataExecute(),
    //                 feStatisticExecute(),
    //             ]);

    //             // Sau khi cả hai promise đã hoàn thành, tiếp tục với các bước tiếp theo
    //             dispatch(appActions.getHomePage({
    //                 categoryCourseFree: categoryCourseFree,
    //                 categoryCourseTop: categoryCourseTop,
    //                 getFeStatistic: getFeStatistic,
    //                 newsData: newsData,
    //                 expertList: expertList,
    //                 categoryCourseNew: categoryCourseNew,
    //                 reviewData:reviewData,
    //             }));
    //         } catch (error) {
    //             console.error('Error fetching data:', error);
    //         }
    //     };

    //     fetchData();
    // }, [  ]);

    useEffect(() => {}, []);

    const { cart } = useShoppingCart({ immediate: true });
    const renderRoute = (route) => {
        // TODO: handle render component by site config
        const component = route.component || PageNotFound;

        return (
            <Route
                key={route.path || 'not-found'}
                path={route.path}
                index={route.index}
                element={
                    loadingProfile ? (
                        <Loading show />
                    ) : (
                        <ValidateAccess
                            authRequire={route.auth}
                            component={component}
                            componentProps={route.componentProps}
                            isAuthenticated={isAuthenticated}
                            profile={profile}
                            layout={route.layout}
                        />
                    )
                }
            />
        );
    };

    return (
        <BrowserRouter>
            <InitRoute />
            <Routes>
                <Route element={<AppNavigate />}>{routesArray.map(renderRoute)}</Route>
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
