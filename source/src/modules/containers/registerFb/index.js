import RenderContext from '@components/common/elements/RenderContext';
import useDevices from '@hooks/useDevices';
import LandingPageDesktop from '@modules/layout/desktop/landing';
import RegisterFBMobileComponent from '@modules/layout/mobile/login/RegisterFB';
import React from 'react';
const RegisterFBPageContainer = () => {
    const { isMobile } = useDevices();

    return (
        <RenderContext
            components={{
                desktop: {
                    defaultTheme: LandingPageDesktop,
                },
                mobile: {
                    defaultTheme: RegisterFBMobileComponent,
                },
            }}
            layout={isMobile ? { defaultTheme: RegisterFBMobileComponent } : null}
        />
    );
};

export default RegisterFBPageContainer;
