import React from 'react';
import 'rc-tooltip/assets/bootstrap.css';
const SkeLeton = ({ children, place, content, trigger, overlayClassName, numRow, style, loading, ...rest }) => {
    const skeletons = [];


    return <div style={style}>{skeletons}</div>;
};

export default SkeLeton;
