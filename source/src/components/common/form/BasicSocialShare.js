import React from 'react';
import { useState } from 'react';
import styles from './Modal.module.scss';
import BasicModal from './BasicModal';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
// import close from '@assets/icons/close.png';
import {
    EmailIcon,
    EmailShareButton,
    FacebookIcon,
    FacebookMessengerIcon,
    FacebookMessengerShareButton,
    FacebookShareButton,
    FacebookShareCount,
    GabIcon,
    GabShareButton,
    HatenaIcon,
    HatenaShareButton,
    HatenaShareCount,
    InstapaperIcon,
    InstapaperShareButton,
    LineIcon,
    LineShareButton,
    LinkedinIcon,
    LinkedinShareButton,
    LivejournalIcon,
    LivejournalShareButton,
    MailruIcon,
    MailruShareButton,
    OKIcon,
    OKShareButton,
    OKShareCount,
    PinterestIcon,
    PinterestShareButton,
    PinterestShareCount,
    PocketIcon,
    PocketShareButton,
    RedditIcon,
    RedditShareButton,
    RedditShareCount,
    TelegramIcon,
    TelegramShareButton,
    TumblrIcon,
    TumblrShareButton,
    TumblrShareCount,
    TwitterShareButton,
    ViberIcon,
    ViberShareButton,
    VKIcon,
    VKShareButton,
    VKShareCount,
    WeiboIcon,
    WeiboShareButton,
    WhatsappIcon,
    WhatsappShareButton,
    WorkplaceIcon,
    WorkplaceShareButton,
    XIcon,
} from 'react-share';
import { useLocation } from 'react-router-dom';
import useTranslate from '@hooks/useTranslate';
import { defineMessages } from 'react-intl';
import SlickCarousel from '@modules/layout/desktop/landing/common/SlickCarousell';
import ImgButton from '@modules/layout/mobile/common/Button';
import arrowRight from '@assets/icons/arowrightbtn.svg';
import Typo from '../elements/Typo';
import { AppConstants } from '@constants';
const message = defineMessages({
    share: 'Chia sẻ',
});
const BasicSocialShare = ({ opened, close, param, registerRetailData }) => {
    const location = useLocation();
    const translate = useTranslate();
    const url = window.location.origin + window.location.pathname;
    const shareUrl = `${url}?sellCode=${registerRetailData?.data?.refCode}`;
    return (
        <BasicModal
            size="calc(30vw)"
            isOpen={opened}
            onCloseModal={close}
            footer={false}
            title={translate.formatMessage(message.share)}
            style={{ position: 'relative', width: '50vw', height: '50vh' }}
        >
            <div style={{ padding: '0 10px' }}>
                <SlickCarousel
                    gap={'10'}
                    column={6}
                    slidesToScroll={4}
                    height={100}
                    responsive={false}
                    prevArrow={<ImgButton img={arrowRight} revert={true} width={40} height={40} />}
                    nextArrow={<ImgButton img={arrowRight} width={40} height={40}/>}
                >
                    <FacebookShareButton url={shareUrl}>
                        <FacebookIcon size={68} round />
                        <Typo size="tiny">Facebook</Typo>
                    </FacebookShareButton>
                    <FacebookMessengerShareButton url={shareUrl} appId="521270401588372">
                        <FacebookMessengerIcon size={68} round />
                        <Typo size="tiny">messenger</Typo>
                    </FacebookMessengerShareButton>
                    <TwitterShareButton url={shareUrl} title={'title'} className="Demo__some-network__share-button">
                        <XIcon size={68} round />
                        <Typo size="tiny">X</Typo>
                    </TwitterShareButton>
                    <TelegramShareButton url={shareUrl} className="Demo__some-network__share-button">
                        <TelegramIcon size={68} round />
                        <Typo size="tiny">Telegram</Typo>
                    </TelegramShareButton>
                    <WhatsappShareButton url={shareUrl} separator=":: " className="Demo__some-network__share-button">
                        <WhatsappIcon size={68} round />
                        <Typo size="tiny">WhatsApp</Typo>
                    </WhatsappShareButton>
                    <LinkedinShareButton url={shareUrl} className="Demo__some-network__share-button">
                        <LinkedinIcon size={68} round />
                        <Typo size="tiny">Linkedin</Typo>
                    </LinkedinShareButton>
                    <PinterestShareButton url={String(window.location)} className="Demo__some-network__share-button">
                        <PinterestIcon size={68} round />
                        <Typo size="tiny">Pinterest</Typo>
                    </PinterestShareButton>
                    <VKShareButton url={shareUrl} className="Demo__some-network__share-button">
                        <VKIcon size={68} round />
                        <Typo size="tiny">VK</Typo>
                    </VKShareButton>
                    <OKShareButton url={shareUrl} className="Demo__some-network__share-button">
                        <OKIcon size={68} round />
                        <Typo size="tiny">Ok</Typo>
                    </OKShareButton>
                    <RedditShareButton
                        url={shareUrl}
                        windowWidth={660}
                        windowHeight={460}
                        className="Demo__some-network__share-button"
                    >
                        <RedditIcon size={68} round />
                        <Typo size="tiny">Reddit</Typo>
                    </RedditShareButton>
                    <GabShareButton
                        url={shareUrl}
                        windowWidth={660}
                        windowHeight={640}
                        className="Demo__some-network__share-button"
                    >
                        <GabIcon size={68} round />
                        <Typo size="tiny">Gab</Typo>
                    </GabShareButton>
                </SlickCarousel>
                <input
                    placeholder="Clearable input"
                    value={shareUrl}
                    size="lg"
                    radius="md"
                />
            </div>
        </BasicModal>
    );
};

export default BasicSocialShare;
