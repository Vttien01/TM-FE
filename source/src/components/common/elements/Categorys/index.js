import React from 'react';
import styles from './index.module.scss';
import classNames from 'classnames';
import Slider from 'react-slick';
import arrow from '@assets/icons/arrow.svg';
import { Link, useNavigate } from 'react-router-dom';
import CardCategory from '../CardCategorys';
import arrowRight from '@assets/icons/arowright.png';

import ImgButton from '@modules/layout/desktop/landing/Feedback/FeedbackCarousel/Button';
import CategoryCarousel from './CategoryCarousel';
import ContentLanding from '@modules/layout/desktop/landing/ContentLanding';
import Healing from '../Healing';
import Typo from '../Typo';
import { FormattedMessage } from 'react-intl';
import routes from '@routes';
import { categoryKinds } from '@constants';
import { generatePath } from 'react-router-dom';
const CategoryItem = ({ data, renderLink, renderTitle, style }) => {
    const navigate = useNavigate();
    const navigateDetail = () => {
        navigate(generatePath(routes.CategoryPage.path, { id: data?.category?.id }), {
            state: {
                action: 'home',
                prevPath: location.pathname,
            },
        });
    };
    return (
        <div style={style} className={(classNames(styles.categoryDesktop), 'category-desktop')}>
        </div>
    );
};
export default CategoryItem;
