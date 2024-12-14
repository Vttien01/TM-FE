import React, { useEffect, useRef, useState } from 'react';

import Loading from '../src/components/common/loading';
import AppRoutes from '../src/routes/routes';
import NotificationElement from '../src/components/common/form/NotificationElement';
import AppLoading from '../src/modules/layout/common/AppLoading';
import Chatbot from '@components/common/elements/ChatBot';
import useDisclosure from '@hooks/useDisclosure';
import ChatButton from '@assets/images/chatButton.png';
const App = () => {
    return (
        <React.Suspense fallback={<Loading show />}>
            <ChatBotComponent />
            <AppLoading />
            <AppRoutes />
            <NotificationElement />
        </React.Suspense>
    );
};

const ChatBotComponent = ({ chatBot }) => {
    const [ openChat, handleChat ] = useDisclosure(true);
    const chatRef = useRef(null);
    const [ isChatVisible, setIsChatVisible ] = useState(false);
    const handleChatButtonClick = () => {
        setIsChatVisible(true);
    };
    const handleCloseIconClick = () => {
        setIsChatVisible(false);
    };
    useEffect(() => {
        if (document) {
            document.body.style.overflow = isChatVisible ? 'hidden' : 'auto';
        }
    }, [ isChatVisible ]);
    return (
        <div className={'chat-bot'}>
            <div className="content">
                {isChatVisible ? (
                    <>
                        {
                            <div className="frameChatBot">
                                <Chatbot handleCloseIconClick={handleCloseIconClick} src={''} />
                            </div>
                        }
                    </>
                ) : (
                    <img src={ChatButton} onClick={handleChatButtonClick} className="button-chat" />
                )}
            </div>
        </div>
    );
};

export default App;
