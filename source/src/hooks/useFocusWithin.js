import { useState, useRef } from 'react';

const useFocusWithin = () => {
    const [ focused, setFocused ] = useState(false);
    const ref = useRef(null);

    const handleFocus = () => setFocused(true);
    const handleBlur = (e) => {
        // Kiểm tra nếu focus ra khỏi phần tử con
        if (ref.current && !ref.current.contains(e.relatedTarget)) {
            setFocused(false);
        }
    };

    return {
        ref,
        focused,
        onFocus: handleFocus,
        onBlur: handleBlur,
    };
};

export default useFocusWithin;
