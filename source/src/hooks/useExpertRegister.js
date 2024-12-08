import { storageKeys } from '@constants';
import { EXPERT_REGISTRATION_ERROR_PHONE_OR_EMAIL_ALREADY_USED, REF_CODE_ERROR_INVALID } from '@constants/ErrorCode';
import apiConfig from '@constants/apiConfig';
import { commonValidation } from '@constants/intl';
import useFetch from '@hooks/useFetch';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import { showSucsessMessage } from '@services/notifyService';
import { removeItem } from '@utils/localStorage';
import { defineMessages } from 'react-intl';
import { useDispatch } from 'react-redux';
import { generatePath, useNavigate } from 'react-router-dom';

const message = defineMessages({
    registerSuccess: 'Đăng ký thành công',
    registerFail: 'Đăng ký thất bại',
});
const useExpertRegister = ({ close, form }) => {
    const translate = useTranslate();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { execute: createExpert, loading: loadingexpert } = useFetch(apiConfig.expertRegistration.create);
    const onFinish = (values) => {
        // const refcode = getData(storageKeys.REF_CODE);
        const identification = {
            desc: values?.introduction,
            shortInfo: values?.shortInfo,
        };
        createExpert({
            data: {
                ...values,
                introduction: JSON.stringify(identification),
                // ...(refcode && { referralCode: refcode }),
            },
            onCompleted: (res) => {
                showSucsessMessage('Đăng ký thành công');
                removeItem(storageKeys.REF_CODE);
                if (close) {
                    close();
                } else {
                    navigate(generatePath(routes.homePage.path), {
                        state: { action: 'home', prevPath: location.pathname },
                    });
                }
            },
            onError: (error) => {
                if (error?.response?.data?.code == EXPERT_REGISTRATION_ERROR_PHONE_OR_EMAIL_ALREADY_USED) {
                    console.log(form);
                    if (form) {
                        form.setFieldError('phone', ' ');
                        form.setFieldError('email', ' ');
                    } 
                }

                if (error?.response?.data?.code == REF_CODE_ERROR_INVALID) {
                    if (form) {
                        form.setFieldError('referralCode', translate.formatMessage(commonValidation.refCodeInvaild));
                        
                       
                        removeItem(storageKeys.REF_CODE);
                        
                        // form.setValues({ referralCode : "" });
                        // showErrorMessage(translate.formatMessage(commonValidation.refCodeInvaild));
                    }
                }
                // removeItem(storageKeys.REF_CODE);
                // if (close) {
                //     close();
                // } else {
                //     navigate(generatePath(routes.homePage.path), {
                //         state: { action: 'home', prevPath: location.pathname },
                //     });
                // }
            },
        });
    };
    return {
        executeExpertRegister: onFinish,
        loading: loadingexpert,
    };
};

export default useExpertRegister;
