import RenderContext from '@components/common/elements/RenderContext';
import useDevices from '@hooks/useDevices';
import LandingPageDesktop from '@modules/layout/desktop/landing';
import ForgetPasswordMobileComponent from '@modules/layout/mobile/login/ForgetPassword';
import ChangePasswordMobileComponent from '@modules/layout/mobile/login/ForgetPassword/ChangePassword';
import React from 'react';
const ChangeForgetPasswordPageContainer = () => {
    const { isMobile } = useDevices();

    return (
        <RenderContext
            components={{
                desktop: {
                    defaultTheme: LandingPageDesktop,
                },
                mobile: {
                    defaultTheme: ChangePasswordMobileComponent,
                },
            }}
            layout={isMobile ? { defaultTheme: ChangePasswordMobileComponent } : null}
        />
    );
};

export default ChangeForgetPasswordPageContainer;
