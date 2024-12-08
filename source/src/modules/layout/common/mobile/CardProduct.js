import React from 'react';
import { Link } from 'react-router-dom';
import Typo from '@components/common/elements/Typo';
import useFetch from '@hooks/useFetch';
import { formatMoney } from '@utils';
import { FormattedMessage } from 'react-intl';
import routes from '@routes';
import { generatePath, useNavigate } from 'react-router-dom';
import { AppConstants } from '@constants';
import { price } from '@utils';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@constants/intl';
import category from '@assets/images/category.png';

const CardProduct = ({ item }) => {
    const navigate = useNavigate();
    const translate = useTranslate();
    const navigateDetail = () => {
        navigate(generatePath(routes.detailPage.path, { id: item?.id }));
    };

    return (
        <div>
        </div>
    );
};

export default CardProduct;
