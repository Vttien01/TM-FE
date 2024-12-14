import React, { useEffect, useRef, useState } from 'react';
import { RemoteRunnable } from '@langchain/core/runnables/remote';
import styles from './index.module.scss';
import { ReactComponent as ChatIcon } from '@assets/icons/chat.svg';
import { ReactComponent as CloseIcon } from '@assets/icons/close.svg';
import { ReactComponent as Loader } from '@assets/icons/loader.svg';
import ReactMarkdown from 'react-markdown';
import * as ReactDOM from 'react-dom';

const Chatbot = ({ handleCloseIconClick, src }) => {
    const remoteChain = new RemoteRunnable({
        url: src,
    });
    const [ input, setInput ] = useState('');
    const [ messagesContent, setMessagesContent ] = useState();

    const [ isSending, setIsSending ] = useState(false);
    const msgHistory = [];
    const formRef = useRef(null);
    const inputRef = useRef(null);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [ messagesContent ]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scroll({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [ msgHistory ]);
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                // Assuming mobile devices have width <= 768px
                const windowHeight = window.innerHeight;
                formRef.current.style.height = `${windowHeight}px`;
            }
        };

        const handleFocus = () => {
            if (window.innerWidth <= 768) {
                setTimeout(() => {
                    inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 300);
            }
        };

        const handleBlur = () => {
            if (window.innerWidth <= 768) {
                formRef.current.style.height = '100%';
            }
        };

        window.addEventListener('resize', handleResize);
        inputRef.current.addEventListener('focus', handleFocus);
        inputRef.current.addEventListener('blur', handleBlur);

        return () => {
            window?.removeEventListener('resize', handleResize);
            inputRef.current?.removeEventListener('focus', handleFocus);
            inputRef.current?.removeEventListener('blur', handleBlur);
        };
    }, []);

    const sendRequest = async (content) => {
        msgHistory.push({
            type: 'human',
            content,
        });
        const stream = await remoteChain.streamLog({
            messages: msgHistory,
        });

        const { wrapper: aiMsgWrapper, contentSpan, loadingSpan } = initAIMsgComponent();
        document.getElementById('conversation-wrapper').appendChild(aiMsgWrapper);

        let responseText = '',
            runId = '';
        for await (const chunk of stream) {
            if (chunk.ops[0].op === 'replace' && chunk.ops[0].value.type === 'chain') {
                runId = chunk.ops[0].value.id;
            } else if (chunk.ops[0].path === '/streamed_output/-' && chunk.ops[0].op === 'add') {
                responseText += chunk.ops[0].value;
                setMessagesContent(responseText);
                loadingSpan.remove();
                ReactDOM.render(<ReactMarkdown>{responseText}</ReactMarkdown>, contentSpan);
            }
        }
        setMessagesContent();

        msgHistory.push({
            type: 'ai',
            content: responseText,
            runId,
        });
    };

    const generateTitleRoleMsg = (role) => {
        const h2 = document.createElement('h2');
        h2.textContent = role === 'ai' ? 'AI' : 'HUMAN';
        return h2;
    };

    const initAIMsgComponent = () => {
        const contentSpan = document.createElement('div');
        contentSpan.textContent = '';

        // const roleText = generateTitleRoleMsg('ai');
        const loadingSpan = document.createElement('div');
        loadingSpan.classList.add(styles.loader);

        const wrapper = document.createElement('div');
        wrapper.classList.add(styles.aiMsgWrapper);
        contentSpan.classList.add(styles.messageWrapper);

        // wrapper.appendChild(roleText);
        wrapper.appendChild(contentSpan);
        wrapper.appendChild(loadingSpan);
        return { wrapper, contentSpan, loadingSpan };
    };

    const generateHumanMsgComponent = (content) => {
        const contentSpan = document.createElement('div');
        contentSpan.textContent = content;

        // const roleText = generateTitleRoleMsg('human');

        const wrapper = document.createElement('div');
        wrapper.classList.add(styles.humanMsgWrapper);
        contentSpan.classList.add(styles.messageWrapper);

        // wrapper.appendChild(roleText);
        wrapper.appendChild(contentSpan);

        return wrapper;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (input.trim() === '') return;
        setIsSending(true);
        document.getElementById('conversation-wrapper').appendChild(generateHumanMsgComponent(input));
        try {
            await sendRequest(input);
        } catch (error) {
            console.error('Error sending request:', error);
        } finally {
            setInput('');
            setIsSending(false);
        }
    };

    return (
        <div className={styles.chatBot}>
            <div className={styles.headerChat}>
                <div className={styles.titleChat}>
                    <ChatIcon />
                    <p className={styles.titleText}>Chat window</p>
                </div>
                <div onClick={handleCloseIconClick} style={{ cursor: 'pointer' }}>
                    <CloseIcon />
                </div>
            </div>
            <div ref={formRef} className={styles.chatContainer}>
                <div id="conversation-wrapper" className={styles.messages} ref={scrollRef} />
                <form onSubmit={handleSubmit} className={styles.inputContainer}>
                    <input
                        type="text"
                        id="input"
                        value={input}
                        ref={inputRef}
                        onChange={(e) => setInput(e.target.value)}
                        readOnly={isSending}
                        autoComplete="off"
                        placeholder="Your message"
                    />

                    <button className={styles.btnSend} type="submit" id="submit" disabled={isSending}>
                        {!isSending ? 'Send' : <Loader className={styles.spinner} />}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chatbot;
