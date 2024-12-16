import React from 'react';
import styles from './button.module.scss';
import classNames from 'classnames';
const ImgButton = ({ className, style, onClick, img, revert, width = '70px', height = '70px', marginTop }) => {
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
                marginLeft:-20,
                marginRight:-25,
                marginTop: marginTop,
            }}
            onClick={onClick}
        >
            <div style={!revert ? { position: 'absolute', left: '30px' } : { position: 'absolute', right: '-5px' }}>
                <img
                    className={styles.button__image}
                    // src={`${URL_IMG}${item?.img}`}
                    src={img}
                    alt="product"
                    style={revert ? { transform: 'rotate(180deg)', marginRight: '30px' } : {}}
                />
            </div>
        </div>
    );
};

export default ImgButton;
