import RenderContext from '@components/common/elements/RenderContext';
import useDevices from '@hooks/useDevices';
import LandingPageDesktop from '@modules/layout/desktop/landing';
import ModalGgRegister from '@modules/layout/mobile/login/RegisterGG/ModalGGRegister';
import React from 'react';
const RegisterGGPageContainer = () => {
    const { isMobile } = useDevices();

    return (
        <RenderContext
            components={{
                desktop: {
                    defaultTheme: LandingPageDesktop,
                },
                mobile: {
                    defaultTheme: ModalGgRegister,
                },
            }}
            layout={isMobile ? { defaultTheme: ModalGgRegister } : null}
        />
    );
};

export default RegisterGGPageContainer;
