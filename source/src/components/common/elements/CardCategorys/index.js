import React, { useState } from 'react';
import styles from './index.module.scss';
import star from '@assets/icons/star.svg';
import { formatMoney, limitCharacters, timeConvert, timeConvertShort } from '@utils/index';
import { generatePath, useNavigate } from 'react-router-dom';
import Typo from '../Typo';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import routes from '@routes';
import { AppConstants, SINGLE_KIND } from '@constants';
import { price } from '@utils/index';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@constants/intl';

import category from '@assets/images/category.png';

const CardCategory = ({ data }) => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const navigateDetail = () => {
        navigate(generatePath(routes.detailPage.path, { id: data?.id }), {
            state: {
                action: 'home',
                prevPath: location.pathname,
            },
        });
    };
    const [ isHovered, setIsHovered ] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return (

        <div></div>
    );
};

export default CardCategory;
