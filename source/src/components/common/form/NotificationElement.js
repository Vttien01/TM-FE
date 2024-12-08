import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NotificationElement = (props) => {
    const { position, autoClose, theme } = props;
    return (
        <ToastContainer
            position={position || 'top-right'}
            autoClose={autoClose || 5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme={theme || 'light'}
        />
    );
};

export default NotificationElement;
