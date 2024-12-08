

import React from 'react';

const Healing = ({ size = 'normal', type = 'normal', children, className, style }) => {
    const sizeType = {
        small: 'var(--h3-font-size)',
        normal: 'var(--h2-font-size)',
        big: 'var(--h1-font-size)',
    };

    const weightType = {
        bold: 'var(--font-bold)',
        normal: 'var(--font-normal)',
        semi: 'var(--font-semi-bold)',
    };

    return (
        <div
            className={className}
            style={{
                fontSize: sizeType[size],
                fontWeight: weightType[type],
                ...style,
            }}
        >
            {children}
        </div>
    );
};

export default Healing;
