import RenderContext from '@components/common/elements/RenderContext';
import useDevices from '@hooks/useDevices';
import LandingPageDesktop from '@modules/layout/desktop/landing';
import LoginDesktop from '@modules/layout/desktop/login';
import LoginMobileComponent from '@modules/layout/mobile/login';
import React from 'react';
const LoginPageContainer = () => {
    const { isMobile } = useDevices();

    return (
        <RenderContext
            components={{
                desktop: {
                    defaultTheme: LoginDesktop,
                },
                mobile: {
                    defaultTheme: LoginMobileComponent,
                },
            }}
            layout={isMobile ? { defaultTheme: LoginMobileComponent } : { defaultTheme: LoginDesktop }}
        />
    );
};

export default LoginPageContainer;
