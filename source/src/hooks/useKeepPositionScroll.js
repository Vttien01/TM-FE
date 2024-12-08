import { useLocation } from 'react-router';
import { useState, useEffect } from 'react';

const useKeepPositionScroll = () => {
    const root = document.getElementsByTagName('body')[0];
    let location = useLocation();
    const [ scrollTop, setScrollTop ] = useState(0);
    const [ isScroll, setIsScroll ] = useState(false);

    useEffect(() => {
        let newScrollPosition = [];

        // get scrollPosition from sessionStorage
        const scrollPosition = JSON.parse(sessionStorage.getItem('scroll-position')) || [];

        // get index
        const id = scrollPosition.findIndex((v) => v.pathname === location.pathname);

        // check if pathname exist in storage

        if (id !== -1) {
            // if not scroll then default scroll to position available in storage
            if (!isScroll) {
                root.scrollTo(0, scrollPosition[id].position);
            }

            // update sessionStorage
            newScrollPosition = [ ...scrollPosition ];
            newScrollPosition.splice(id, 1, {
                pathname: location.pathname,
                position: scrollTop,
            });

            sessionStorage.setItem('scroll-position', JSON.stringify(newScrollPosition));

            return;
        }

        newScrollPosition = [
            ...scrollPosition,
            {
                pathname: location.pathname,
                position: 0,
            },
        ];

        sessionStorage.setItem('scroll-position', JSON.stringify(newScrollPosition));
        window.scrollTo(0, 0);
    }, [ scrollTop, location.pathname, isScroll ]);

    // Get scroll top
    const windowScrollTop = () => {
        const position = root.scrollTop;

        setIsScroll(true);
        setScrollTop(position);
    };

    useEffect(() => {
        root.addEventListener('scroll', windowScrollTop);
        return () => root.removeEventListener('scroll', windowScrollTop);
    }, []);

    return location;
};
export default useKeepPositionScroll;
