import React from 'react';
import styles from './index.module.scss';
import BasicModal from '@components/common/form/BasicModal';
import { FormattedMessage, defineMessages } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import iconGoogle from '@assets/icons/brandGoogle.svg';
import iconFacebook from '@assets/icons/brandFacebook.svg';
import {
    AppConstants,
    GROUP_KIND_EXPERT,
    GROUP_KIND_SELLER,
    GROUP_KIND_STUDENT,
    appAccount,
    storageKeys,
} from '@constants';
import useFetch from '@hooks/useFetch';
import apiConfig from '@constants/apiConfig';
import useFetchAction from '@hooks/useFetchAction';
import { accountActions } from '@store/actions';
import { setCacheAccessToken } from '@services/userService';
import { setData } from '@utils/localStorage';
import { showErrorMessage, showInfoMessage, showSucsessMessage, showWarningMessage } from '@services/notifyService';
import useRegister from '@hooks/useRegister';
import { useState } from 'react';
import { actions } from '@store/actions/app';
import { useDispatch, useSelector } from 'react-redux';
import { getData } from '@utils/localStorage';
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
    validateConfirmPassword: 'Mật khẩu không trùng khớp',
    refCode: 'Mã giới thiệu',
});
const ModalRegisterForm = ({ isOpenRegister, isCloseRegister, isOpenLogin, data }) => {
    const translate = useTranslate();
    const dispatch = useDispatch();
    const [ registerLoading, setLoading ] = useState(false);
    const refcode = getData(storageKeys.REF_CODE);
    const cart = useSelector((state) => state.cart.cart);

    const { executeRegister, loading } = useRegister({
        isCloseRegister,
        isOpenLogin,
        isDesktop: true,
    });

    return (
        <div>
            <form>

                <div>
                    <button type="submit" className={{ root: styles.btnRegister, label: styles.label }}>
                        {translate.formatMessage(message.register)}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ModalRegisterForm;
