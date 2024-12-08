import React from 'react';

import { accessRouteTypeEnum } from '@constants';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import routes from '.';
import { useDispatch } from 'react-redux';
import DefaultLayout from '@modules/layout/common/DefaultLayout';
import PublicLayout from '@modules/layout/common/PublicLayout';

const ValidateAccess = ({ authRequire, component: Component, componentProps, isAuthenticated, profile, layout }) => {
    const location = useLocation();
    const dispatch = useDispatch();
    const getRedirect = (authRequire) => {
        // if (authRequire === accessRouteTypeEnum.NOT_LOGIN) {
        //     return routes.homePage.path;
        // }

        // if (authRequire === accessRouteTypeEnum.REQUIRE_LOGIN && !isAuthenticated) {
        //     return routes.homePage.path;
        // }

        // check permistion
        return false;
    };

    // const redirect = getRedirect(authRequire);

    // if (redirect) {
    //     return <Navigate state={{ from: location }} key={redirect} to={redirect} replace />;
    // }
    let Layout = null;
    if (authRequire) {
        Layout = DefaultLayout || layout;
    } else if (authRequire == false) {
        Layout = PublicLayout;
    } else if (authRequire == null) {
        Layout = DefaultLayout || layout;
    }

    // const Layout = authRequire ? layout || DefaultLayout : PublicLayout;

    return (
        <Layout>
            <Component {...(componentProps || {})} dispatch={dispatch}>
                <Outlet />
            </Component>
        </Layout>
    );
};

export default ValidateAccess;
