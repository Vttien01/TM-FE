import RenderContext from '@components/common/elements/RenderContext';
import useDevices from '@hooks/useDevices';
import LandingPageDesktop from '@modules/layout/desktop/landing';
import RegisterMobileComponent from '@modules/layout/mobile/login/Register';
import React from 'react';
const RegisterPageContainer = () => {
    const { isMobile } = useDevices();

    return (
        <RenderContext
            components={{
                desktop: {
                    defaultTheme: LandingPageDesktop,
                },
                mobile: {
                    defaultTheme: RegisterMobileComponent,
                },
            }}
            layout={isMobile ? { defaultTheme: RegisterMobileComponent } : null}
        />
    );
};

export default RegisterPageContainer;
