import React, { useEffect } from 'react';

import Loading from '@components/common/loading';
import AppRoutes from '@routes/routes';
import NotificationElement from '@components/common/form/NotificationElement';
import AppLoading from '@modules/layout/common/AppLoading';
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
