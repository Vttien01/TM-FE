import React from 'react';

const TitleComponents = ({ size, children }) => {
    const sizeType = {
        small: 'var(--h3-font-size}',
        normal: 'var(--h1-font-size}',
        big: 'var(--h1-font-size}',
    };
    return <span style={{ fontSize: sizeType[size] }}>{children}</span>;
};

export default TitleComponents;
