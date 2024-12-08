import React from 'react';
import { Link } from 'react-router-dom';
import Typo from '@components/common/elements/Typo';
import useFetch from '@hooks/useFetch';
import { limitCharacters, price } from '@utils';
import { FormattedMessage } from 'react-intl';
import { AppConstants } from '@constants';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@constants/intl';
import styles from './CardProductExpert.module.scss';
import category from '@assets/images/category.png';

const CardProductExpert = ({ item }) => {
    const translate = useTranslate();
    return (
        <div>
        </div>
    );
};

export default CardProductExpert;
