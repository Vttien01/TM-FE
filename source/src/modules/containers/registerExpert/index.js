import RenderContext from '@components/common/elements/RenderContext';
import useDevices from '@hooks/useDevices';
import LandingPageDesktop from '@modules/layout/desktop/landing';
import RegisterMobileComponent from '@modules/layout/mobile/login/Register';
import RegisterExpertMobileComponent from '@modules/layout/mobile/login/RegisterExpert';
import React from 'react';
const RegisterExpertPageContainer = () => {
    const { isMobile } = useDevices();

    return (
        <RenderContext
            components={{
                desktop: {
                    defaultTheme: LandingPageDesktop,
                },
                mobile: {
                    defaultTheme: RegisterExpertMobileComponent,
                },
            }}
            layout={isMobile ? { defaultTheme: RegisterExpertMobileComponent } : null}
        />
    );
};

export default RegisterExpertPageContainer;
