import {
    appAccount,
    storageKeys,
} from '@constants';
import {
    ACCOUNT_ERROR_EMAIL_EXISTS,
    REF_CODE_STUDENT_ERROR_INVALID,
    USER_ERROR_PHONE_EXISTS,
} from '@constants/ErrorCode';
import apiConfig from '@constants/apiConfig';
import { commonValidation } from '@constants/intl';
import useFetch from '@hooks/useFetch';
import useFetchAction from '@hooks/useFetchAction';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import { showSucsessMessage } from '@services/notifyService';
import { accountActions } from '@store/actions';
import { actions } from '@store/actions/app';
import { getData, removeItem } from '@utils/localStorage';
import { defineMessages } from 'react-intl';
import { useDispatch } from 'react-redux';
import { generatePath, useNavigate } from 'react-router-dom';

const message = defineMessages({
    registerSuccess: 'Đăng ký thành công',
    registerFail: 'Đăng ký thất bại',
    exitsUser: 'Emall hoặc số điện thoại đã tồn tại',
    invailError: 'Email đã tồn tại',
});
const useRegister = ({ isCloseRegister, isOpenLogin, isDesktop, closeRegisterModal, form }) => {
    const translate = useTranslate();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const base64Credentials = Buffer.from(`${appAccount.APP_USERNAME}:${appAccount.APP_PASSWORD}`).toString('base64');
    const { execute, loading } = useFetch({
        ...apiConfig.student.signUp,
        authorization: `Basic ${base64Credentials}`,
    });
    const { execute: executeGetProfile } = useFetchAction(accountActions.getProfile, {
        loading: useFetchAction.LOADING_TYPE.APP,
    });
    const { execute: executeGetSellerProfile } = useFetchAction(accountActions.getSellerProfile, {
        loading: useFetchAction.LOADING_TYPE.APP,
    });
    const { execute: executeGetExpertProfile } = useFetchAction(accountActions.getExpertProfile, {
        loading: useFetchAction.LOADING_TYPE.APP,
    });

    const onFinish = (values) => {
        const refcode = getData(storageKeys.REF_CODE);

        execute({
            data: {
                ...values,
                grant_type: 'student',
                // ...(refcode && { referralCode: refcode }),
            },

            onCompleted: (res) => {
                dispatch(actions.hideAppLoading());
                // setCacheAccessToken(res.access_token);
                // executeGetProfile();
                // console.log(res);
                // showSucsessMessage(res);
                removeItem(storageKeys.REF_CODE);
                showSucsessMessage(translate.formatMessage(message.registerSuccess));
                if (isDesktop) {
                    isCloseRegister();
                    isOpenLogin();
                } else {
                    if (location.pathname === routes.loginPage.path) {
                        closeRegisterModal();
                    } else {
                        navigate(generatePath(`${routes.loginPage.path}?isRegisterSuccess=${true}`), {
                            state: { action: 'login', prevPath: location.pathname },
                        });
                    }
                }
            },
            onError: (res) => {
                dispatch(actions.hideAppLoading());

                if (res?.response?.data?.code == ACCOUNT_ERROR_EMAIL_EXISTS) {
                    form.setFieldError('email', translate.formatMessage(commonValidation.emailValidation));
                }
                if (res?.response?.data?.code == USER_ERROR_PHONE_EXISTS) {
                    form.setFieldError('phone', translate.formatMessage(commonValidation.phoneExitsValidation));
                }
                if (res?.response?.data?.code == REF_CODE_STUDENT_ERROR_INVALID) {
                    form.setFieldError('referralCode', translate.formatMessage(commonValidation.refCodeInvaild));
                    removeItem(storageKeys.REF_CODE);
                }
            },
        });
    };
    return {
        executeRegister: onFinish,
        loading,
    };
};

export default useRegister;
