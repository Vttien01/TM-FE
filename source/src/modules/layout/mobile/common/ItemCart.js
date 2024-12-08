import React, { useEffect, useState } from 'react';
import styles from './itemCart.module.scss';
import classNames from 'classnames';
import IconClock from '@assets/icons/clockicon.png';
import IconCourse from '@assets/icons/courseicon.png';
import { FormattedMessage, defineMessages } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import Typo from '@components/common/elements/Typo';
import category from '@assets/images/category.png';
import { AppConstants } from '@constants';
import { IconTrash } from '@tabler/icons-react';
import { price } from '@utils';
import { commonMessage } from '@constants/intl';
import { useNavigate, useNavigation } from 'react-router-dom';
const ItemCart = ({ data, removeItem, coupon, profile, isUseSellCode, checkSellCode }) => {
    const translate = useTranslate();
    const navigation = useNavigate();
    const paymentTotal =  data?.saleOff
        ? data?.price - ((data?.price * 1) / 100) * data?.saleOff
        : data?.price;
    const DeleteItemConfirm = (data) => {
        console.log(data)
    };
    return (
        <div className={styles.item} onClick={() => navigation(`/detail/${data.id}`)}>
           
        </div>
    );
};

export default ItemCart;
