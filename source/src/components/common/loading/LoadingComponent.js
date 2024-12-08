import React from 'react';
import LoadingSpin from 'react-loading-spin';

const LoadingComponent = ({ size = '', primaryColor = 'var(--primary-color)' }) => {
    return <LoadingSpin primaryColor={primaryColor} />;
};

export default LoadingComponent;