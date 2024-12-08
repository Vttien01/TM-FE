import { useEffect, useState } from 'react';
import { isDesktop, isMobile } from 'react-device-detect';
const calcDevices = (width) => {
    const isMobile = width < 768;
    const isDesktop = !isMobile;
    return { isMobile, isDesktop };
};

const useDevices = () => {
    const [ devices, setDevices ] = useState({
        isMobile,
        isDesktop: !isDesktop,
    });

    const handleResize = (e) => {
        setDevices({
            isMobile,
            isDesktop: !isDesktop,
        });
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return devices;
};

export default useDevices;