import React, { useEffect } from 'react';

import { Routes, BrowserRouter, Route, useLocation } from 'react-router-dom';

import ValidateAccess from './ValidateAccess';

import routes from '.';
import useAuth from '../../src/hooks/useAuth';
import Loading from '../../src/components/common/loading';
import PageNotFound from '../../src/components/common/page/PageNotFound';
import AppNavigate from '../../src/modules/layout/common/AppNavigate';
// import { webSocket } from '../../src/utils/webSocket';
import { getCacheAccessToken } from '../../src/services/userService';
import useTranslate from '../../src/hooks/useTranslate';
import { useDispatch } from 'react-redux';
import { appActions, cartActions } from '../../src/store/actions';
import useFetch from '../../src/hooks/useFetch';
import apiConfig from '../../src/constants/apiConfig';
import useShoppingCart from '../../src/hooks/useShoppingCart';
import InitRoute from './InitRoute';
const routesArray = Object.values(routes);

const AppRoutes = () => {
    const { isAuthenticated, loading: loadingProfile, profile } = useAuth();
    const translate = useTranslate();
    const dispatch = useDispatch();

    useEffect(() => {}, []);
    const renderRoute = (route) => {
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
