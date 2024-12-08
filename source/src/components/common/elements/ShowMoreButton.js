import React from 'react';
import styles from './ShowMore.module.scss';
const ShowMoreButton = ({ handleShowMore }) => {
    return (
        <div className={styles.more} onClick={handleShowMore}>
            Show more &darr;
        </div>
    );
};

export default ShowMoreButton;
