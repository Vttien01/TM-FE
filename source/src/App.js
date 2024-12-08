import React, { useEffect } from 'react';

import Loading from '../src/components/common/loading';
import AppRoutes from '@routes/routes';
import NotificationElement from '../src/components/common/form/NotificationElement';
import AppLoading from '../src/modules/layout/common/AppLoading';
const App = () => {
    return (
        <React.Suspense fallback={<Loading show />}>
            <AppLoading />
            <AppRoutes />
            <NotificationElement />
        </React.Suspense>
    );
};

export default App;
