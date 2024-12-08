import React, { useEffect, useMemo, useState } from 'react';
import ReactQuill from 'react-quill';
import useTranslate from '@hooks/useTranslate';
import { IconChevronDown } from '@tabler/icons-react';
import { defineMessages } from 'react-intl';
import 'react-quill/dist/quill.snow.css';

import Typo from './Typo';

const message = defineMessages({
    seeMore: 'Hiện thêm',
});
const RichTextRender = ({ data, MAX_LENGTH_TEXT_EDITOR = 2000, ...props }) => {
    const queryParameters = new URLSearchParams(window.location.search);
    const lessonId = queryParameters.get('lessonId');
    const translate = useTranslate();
    const [ showFullText, setShowFullText ] = useState(false);
    const maxLength = MAX_LENGTH_TEXT_EDITOR;
    let truncatedText = data;
    if (truncatedText?.length > maxLength) {
        // Nếu lớn hơn, cắt chuỗi thành maxLength ký tự
        truncatedText = truncatedText.substring(0, maxLength);
        while (truncatedText[truncatedText?.length - 1] !== '>') {
            truncatedText = truncatedText.slice(0, -1);
        }
    }

    const toggleShowFullText = () => {
        setShowFullText(!showFullText);
        truncatedText = data;
    };
    useEffect(() => {
        setShowFullText(false);
    }, [ lessonId ]);

    return (
        <div
            style={{
                marginBottom: '1rem',
                paddingTop: '4px',
            }}
        >
            <div
                style={{
                    WebkitMaskImage:
                        !showFullText && data?.length > maxLength
                            ? 'linear-gradient(#ffffff, #ffffff,#ffffff,#ffffff, rgba(255, 255, 255, 0.2))'
                            : 'none',
                    width: '100%',
                    fontFamily: 'SFPro, sans-serif',
                }}
            >
                <ReactQuill value={showFullText ? data : truncatedText} readOnly={true} theme={'bubble'} style={{ lineHeight: '2' }} {...props} />
            </div>
            {!showFullText && data?.length > maxLength && (
                <button
                    onClick={toggleShowFullText}
                >
                    <Typo size="primary" type="semi-bold">
                        {translate.formatMessage(message.seeMore)}
                    </Typo>
                </button>
            )}
        </div>
    );
};

export default RichTextRender;
