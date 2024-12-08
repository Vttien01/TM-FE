import React from 'react';
import styles from './button.module.scss';
import classNames from 'classnames';
const ImgButton = ({ className, style, onClick, img, revert, width = '70px', height = '70px' }) => {
    return (
        <div
            className={classNames(styles.button, className)}
            style={{
                ...style,
                background: 'white',
                width: width,
                height: height,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '50%',
                boxShadow: '0 0 3px #ccc',
                padding: '10px',
            }}
            onClick={onClick}
        >
            <div>
                <img
                    className={styles.button__image}
                    src={img}
                    alt="product"
                    style={revert ? { transform: 'rotate(180deg)', marginRight: '20px' } : {}}
                />
            </div>
        </div>
    );
};

export default ImgButton;
