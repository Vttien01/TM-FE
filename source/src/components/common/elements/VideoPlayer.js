// import enSub from '@assets/subtitles/en.vtt';
// import viSub from '@assets/subtitles/vi.vtt';

import { getYoutubeVideoID, isSafari } from '@utils';
import React, { useMemo } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { toast } from 'react-toastify';
import NotificationElement from '../form/NotificationElement';
import ReactPlayer from 'react-player/lazy';
import { showInfoMessage } from '@services/notifyService';

const message = defineMessages({
    complete: 'Video Completed !!!',
    subtitles: {
        en: {
            id: 'components.elements.videoplayer.subtitle.en',
            defaultMessage: 'English',
        },
        vi: {
            id: 'components.elements.videoplayer.subtitle.vi',
            defaultMessage: 'Vietnamese',
        },
    },
});

function VideoPlayer({ url, width, height, style, autoPlay = true, muted = false, className, subtitles, ...props }) {
    const intl = useIntl();
    const handleVideoEnded = () => {
        showInfoMessage(intl.formatMessage(message.complete));
    };

    return (
        <>
            {' '}
            <ReactPlayer
                url={url}
                style={{ width: width || '100%', height: height || '100%', border: 0, ...style }}
                className={className}
                onEnded={handleVideoEnded}
                width="100%"
                height={height}
                playing={true}
                controls={true}
                config={{
                    youtube: {
                        playerVars: { showinfo: 1 },
                    },
                }}
                {...props}
            />{' '}
            <NotificationElement />
        </>
    );
}

export default VideoPlayer;
