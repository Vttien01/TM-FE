import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';

import store from '../../source/src/store';
import reportWebVitals from './reportWebVitals';

import App from './App';
// core styles are required for all packages
import 'video.js/dist/font/VideoJS.ttf';
import 'videojs-font/css/videojs-icons.css';
import 'video.js/dist/video-js.css'; // Import CSS for Video.js
import '@videojs/themes/dist/sea/index.css';

import '../src/assets/scss/index.scss';
import { setData } from '../../source/src/utils/localStorage';
import { AppConstants, storageKeys } from '../src/constants';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LanguageProvider from '../src/locales/LanguageProvider';
import ReactDOM from 'react-dom/client';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <LanguageProvider>
                <App />
            </LanguageProvider>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
