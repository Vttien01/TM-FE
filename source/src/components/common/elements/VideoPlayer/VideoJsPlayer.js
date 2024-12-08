import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import videojs from 'video.js';
import './VideoJsPlayer.styles.scss'; // styles
import 'video.js/dist/video-js.css'; // videoJs Default Styles
import 'videojs-contrib-quality-levels'; // videoJs Quality levels **
import hls from 'videojs-hls-quality-selector'; // videojs Quality Selector **
import 'videojs-thumbnail-sprite'; // videoJs Thumbnail Plugin
import 'videojs-contrib-ads'; // videoJs ads
import { getQueryParams } from '@utils';
import '@videojs/themes/dist/sea/index.css';
import useFetch from '@hooks/useFetch';
import apiConfig from '@constants/apiConfig';
import { useParams } from 'react-router-dom';
// import image from '@assets/images/bannermobile.png';

const imageLink = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Test-Logo.svg/783px-Test-Logo.svg.png';

// eslint-disable-next-line react/display-name
const VideoJsPlayer = forwardRef((props, ref) => {
    const {
        source,
        handleActionNext,
        height,
        isMobile,
        handleVideoEnded,
        createComplete,
        track,
        secondProgress,
        isFinished,
        name,
        courseName,
        courseImage,
    } = props;
    const options = {
        preload: 'auto',
        autoplay: true,
        controls: true,
        loop: false,
        controlBar: {
            remainingTimeDisplay: {
                displayNegative: false,
            },
        },
        // playbackRates: isMobile ? false : [ 0.5, 1, 1.5, 2, 2.5 ],
        html5: {
            vhs: {
                overrideNative: true,
            },
            nativeVideoTracks: false,
            nativeAudioTracks: false,
            nativeTextTracks: false,
        },
        poster: courseImage ? courseImage : imageLink,
    };
    const [ videoSource, setVideoSource ] = useState(source);
    const [ isClicked, setIsClicked ] = useState(false);
    const videoRef = useRef(null);
    const playerRef = useRef(null);
    const { onReady, teaserStartTime, teaserDuration } = props;
    useEffect(() => {
        setVideoSource(source);
    }, [ source ]);
    const pause = () => {
        const player = playerRef.current;
        if (player) {
            player.pause();
        }
    };

    useImperativeHandle(ref, () => ({
        pause: pause,
    }));
    const TIME_SET_DEFAULT = 5;
    const { execute: executeCompletion, data: completionData } = useFetch(apiConfig.completion.create);
    const queryParameters = new URLSearchParams(window.location.search);
    const lessonId = queryParameters.get('lessonId');
    const params = useParams();
    React.useEffect(() => {
        // make sure Video.js player is only initialized once
        if (!playerRef.current) {
            const videoElement = videoRef.current;
            if (!videoElement) return;
            const player = (playerRef.current = videojs(videoElement, options, () => {
                onReady && onReady(player);

                !isFinished && secondProgress > 0 && player.currentTime(secondProgress);
            }));
            // player.currentTime(5);
            // Cài đặt Media Session API
            if ('mediaSession' in navigator) {
                navigator.mediaSession.metadata = new window.MediaMetadata({
                    title: name ? name : "Tiêu đề video",
                    artist: courseName ? courseName : "Tên khóa học",
                    album: 'Tên album hoặc tập',
                    artwork: [
                        { src: courseImage ? courseImage : imageLink, sizes: '96x96', type: 'image/png' },
                        // Thêm các kích cỡ khác nếu cần
                    ],
                });

                // Cài đặt sự kiện cho các nút điều khiển (tùy chọn)
                navigator.mediaSession.setActionHandler('play', () => player.play());
                navigator.mediaSession.setActionHandler('pause', () => player.pause());
                // Thêm các handler khác cho nexttrack, previoustrack, seekbackward, v.v...
            }
            var approxTime = 0;

            player.on('timeupdate', function () {
                if (track) {
                    var currentTime = Math.floor(player.currentTime());

                    if (currentTime !== approxTime) {
                        approxTime = currentTime;
                        if (approxTime % 5 == 0) {
                            executeCompletion({
                                data: {
                                    courseId: params?.id,
                                    lessonId: lessonId,
                                    secondProgress: approxTime,
                                },
                            });
                        }
                    }
                }
            });
            // handle the quality Levels of Video
            // player.qualityLevels();
            // player.hlsQualitySelector = hls;
            // player.hlsQualitySelector({
            //     displayCurrentQuality: true,
            // });

            // handle the Thumbnail of Video
            // player.thumbnailSprite({
            //     sprites: [
            //         {
            //             url: 'https://static.cdn.asset.filimo.com/filimo-video/85779-thumb-t01.jpg',
            //             start: 0,
            //             duration: 1000,
            //             interval: 10,
            //             width: 106,
            //             height: 60,
            //         },
            //     ],
            // });

            player.on('ended', function () {
                handleVideoEnded();
                player.posterImage.show();
            });

            // or

            // player.on('ended', function () {
            //     player.trigger('loadstart');
            // });

            // handle Ads of Video
            // player.ads();
            // player.on('contentchange', () => {
            //     player.trigger('adsready');
            // });
            // player.ready(function () {
            //     var promise = player.play();
            //     console.log('first');
            //     if (promise !== undefined) {
            //         promise
            //             .then(function () {
            //                 // Autoplay started!
            //             })
            //             .catch(function (error) {
            //                 // Autoplay was prevented.
            //             });
            //     }
            // });
            // player.on('readyforpreroll', function () {
            //     player.ads.startLinearAdMode();

            //     // play your linear ad content
            //     // in this example, we use a static mp4
            //     player.src(source);
            //     // send event when ad is playing to remove loading spinner
            //     player.one('adplaying', function () {
            //         player.trigger('ads-ad-started');
            //     });

            //     // resume content when all your linear ads have finished
            //     player.on('adended', function () {
            //         player.ads.endLinearAdMode();
            //     });
            // });
            // player.trigger('adsready');

            // handle The keyboard Keys
            player.on('keydown', (e) => {
                const playerVolume = player.volume();
                const playerCurrentTime = player.currentTime();
                switch (e.code) {
                                case 'Space':
                                    if (player.paused()) {
                                        player.play();
                                    } else {
                                        player.pause();
                                    }
                                    break;
                                case 'ArrowRight':
                                    player.currentTime(playerCurrentTime + 10);
                                    break;
                                case 'ArrowLeft':
                                    player.currentTime(playerCurrentTime - 10);
                                    break;
                                case 'ArrowUp':
                                    player.volume(playerVolume + 0.1);
                                    break;
                                case 'ArrowDown':
                                    player.volume(playerVolume - 0.1);
                                    break;
                                case 'KeyM':
                                    player.volume(0);
                                    break;
                                default:
                                    return;
                }
            });
        }
    }, [ options, videoRef, source, videoSource ]);

    React.useEffect(() => {
        const player = playerRef.current;
        return () => {
            if (player && !player.isDisposed()) {
                player.dispose();
                playerRef.current = null;
            }
        };
    }, [ playerRef, source ]);
    // console.log(courseImage);
    return (
        <div className="player" style={{ height: height }} key={source}>
            <div data-vjs-player>
                <video poster={courseImage ? courseImage : imageLink} playsInline ref={videoRef} className="video-js vjs-theme-sea vjs-16-9">
                    <source src={source} type="application/x-mpegURL" />
                </video>
            </div>
        </div>
    );
});

export default VideoJsPlayer;
