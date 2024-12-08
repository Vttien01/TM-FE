

import React from 'react';

const Typo = ({ size = 'normal', type = 'normal', children, className, style, onClick }) => {
    const sizeType = {
        big: 'var(--h1-font-size)',
        small: 'var(--h3-font-size)',
        normal: 'var(--h2-font-size)',
        primary: 'var(--primary-font-size)',
        sub: 'var(--sub-font-size)',
        tiny: 'var(--small-font-size)',
    };

    const weightType = {
        bold: 'var(--font-bold)',
        normal: 'var(--font-normal)',
        'semi-bold': 'var(--font-semi-bold)',
    };

    return (
        <div
            className={className}
            style={{
                fontSize: sizeType[size],
                fontWeight: weightType[type],
                fontFamily: 'SFPro, sans-serif',
                ...style,
            }}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

export default Typo;
