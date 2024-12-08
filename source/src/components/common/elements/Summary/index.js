import React, { useEffect } from 'react';
import styles from './index.module.scss';
import { IconAt } from '@tabler/icons-react';
import { IconSearch, IconArrowRight } from '@tabler/icons-react';
import { defineMessages, useIntl, FormattedMessage } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import { IconX } from '@tabler/icons-react';
import Typo from '../Typo';
import { actions, showAppLoginModal } from '@store/actions/app';
import { useDispatch, useSelector } from 'react-redux';

import { price, grandTotal, realTotal, grandTotalCoupon } from '@utils';
import { useNavigate, useNavigation } from 'react-router-dom';
import useAuth from '@hooks/useAuth';
import { appActions } from '@store/actions';
import useFetch from '@hooks/useFetch';
import apiConfig from '@constants/apiConfig';
import { paymentMethods } from '@constants';
import { showErrorMessage } from '@services/notifyService';
import { errorMessage } from '@constants/ErrorCode';
import routes from '@routes';
const message = defineMessages({
    summaryCart: 'Tổng tiền (4 khóa học) :',
    price: 'Giá gốc',
    sale: 'Giá giảm',
    apply: 'Áp dụng',
    payment: 'Thanh toán',
    total: 'Thành tiền',
    coupon: 'Mã khuyến mãi',
    summaryCheckout: 'Tóm tắt đơn hàng',
});

const Summary = ({ varitant, cart, walletBalance, coursePrice, sellCode, coupon, profile, isUseSellCode }) => {
    const translate = useTranslate();
    const dispatch = useDispatch();
    const numberCart = useSelector((state) => state.cart.cart);
    const paymentTotal = profile?.referralCode && isUseSellCode ? grandTotalCoupon(cart, coupon) : grandTotal(cart);
    const summaryCart = (
        <>
            <Typo size="primary" type="semi-bold" style={{ color: 'var(--text-color)' }}>
                {`Tổng tiền (${cart?.length} khóa học)`}
            </Typo>
        </>
    );
  
    const isPaymentCheck = useSelector((state) => state.app.payment);
    const openModalLogin = () => {
        dispatch(showAppLoginModal({}));

        dispatch(appActions.setPayment(true));
    };
    const navigate = useNavigate();
 
    useEffect(() => {
        if (profile && isPaymentCheck) {
            dispatch(appActions.setPayment(false));
            navigate('/payment');
        }
    }, [ profile, numberCart ]);
    const navigation = useNavigate();
    const { execute: createBooking , loading : loadingCreateBooking } = useFetch(apiConfig.booking.create);
    const bookingDirect = () => {
        return navigation(sellCode ? routes.paymentPage.path + `?sellCode=${sellCode}` : routes.paymentPage.path);
    };
    return (
        <div className={styles.Summary}>
            {summaryCart}
            <button
                className={styles.payment}
                size="lg"
                onClick={() => (profile ? bookingDirect() : openModalLogin())}
                disabled={numberCart?.length == 0}
            >
                <Typo size="primary" type="semi-blod">
                    <FormattedMessage defaultMessage="Thanh toán" />
                </Typo>
            </button>
        </div>
    );
};

export default Summary;
