import { ReactComponent as Close } from '@assets/icons/close.svg';
import Typo from '@components/common/elements/Typo';
import { storageKeys } from '@constants';
import useRegister from '@hooks/useRegister';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import { actions } from '@store/actions/app';
import { getData } from '@utils/localStorage';
import React, { useState } from 'react';
import { defineMessages } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { generatePath, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import styles from './index.module.scss';
import { validatePasswordInput } from '@utils';
const message = defineMessages({
    register: 'Đăng ký',
    registerSuccess: 'Đăng ký thành công',
    registerFail: 'Đăng ký thất bại',
    emailAddress: 'Địa chỉ email',
    password: 'Mật khẩu',
    forgetPassword: 'Quên mật khẩu',
    confirmPassword: 'Nhập lại mật khẩu',
    enterPassword: 'Nhập mật khẩu',
    otherLogin: 'Hoặc đăng nhập với',
    fullName: 'Họ và tên',
    phone: 'Số điện thoại',
    refCode: 'Mã giới thiệu',
    validateConfirmPassword: 'Mật khẩu không trùng khớp',
});
const RegisterMobileComponent = ({ closeRegsiter }) => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [ registerLoading, setLoading ] = useState(false);
    const refcode = getData(storageKeys.REF_CODE);
    const cart = useSelector((state) => state.cart.cart);
    const { executeRegister, loading } = useRegister({
        isDesktop: false,
        closeRegisterModal: closeRegsiter,
    });

    return (
        <section className="container">
        </section>
    );
};

export default RegisterMobileComponent;
