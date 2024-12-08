import React, { useEffect } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-contrib-quality-levels';
import hls from 'videojs-hls-quality-selector';

const VideoPlayer = () => {
    useEffect(() => {
        const videoJsOptions = {
            autoplay: true,
            controls: true,
            preload: 'auto',
            fluid: true,
            plugins: {
                httpSourceSelector: {
                    default: 'auto',
                },
            },
            playbackRates: [ 0.5, 1, 1.5, 2 ],
            sources: [
                {
                    src: 'https://lf-video.developteam.net/media/123456789/COURSE/123/livestream.m3u8',
                    type: 'application/x-mpegURL',
                },
            ],
        };

        const player = videojs('videojs', videoJsOptions);
        player.hlsQualitySelector = hls;
        player.hlsQualitySelector(); // Thêm plugin quality selector
        player.httpSourceSelector();
        return () => {
            if (player) {
                player.dispose(); // Hủy player khi component unmount
            }
        };
    }, []);

    return (
        <div data-vjs-player>
            <video id="videojs" className="video-js vjs-default-skin"></video>
        </div>
    );
};

export default VideoPlayer;
