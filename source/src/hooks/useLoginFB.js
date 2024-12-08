import { GROUP_KIND_STUDENT, storageKeys } from '@constants';
import apiConfig from '@constants/apiConfig';
import useFetch from '@hooks/useFetch';
import useFetchAction from '@hooks/useFetchAction';
import { setCacheAccessToken } from '@services/userService';
import { accountActions } from '@store/actions';
import { setData } from '@utils/localStorage';
import { defineMessages } from 'react-intl';
import { useNavigate, generatePath } from 'react-router-dom';
import routes from '@routes';
const message = defineMessages({
    registerSuccess: 'Đăng ký thành công',
    registerFail: 'Đăng ký thất bại',
});
const useLoginFB = ({ setDataFacebook, setOpenProfile }) => {
    const { execute: executeGetProfile } = useFetchAction(accountActions.getProfile, {
        loading: useFetchAction.LOADING_TYPE.APP,
    });
    const navigate = useNavigate();
    const { execute: fbLogin, loading: fbLoginloading } = useFetch(apiConfig.student.LoginFaceBook);
    const loginFaceBookFunc = (fbres) => {
        fbLogin({
            data: { token: fbres?.accessToken },
            onCompleted: (res) => {
                if (res?.data?.accessToken?.access_token) {
                    setCacheAccessToken(res.data.accessToken.access_token);

                    if (res.data?.accessToken?.user_kind === GROUP_KIND_STUDENT) {
                        executeGetProfile();
                        setData(storageKeys.USER_KIND, GROUP_KIND_STUDENT);
                        // showSucsessMessage(translate.formatMessage(message.loginSuccess));
                    }
                } else {
                    if ((setDataFacebook, setOpenProfile)) {
                        // setDataFacebook(res);
                        // setOpenedProfile(true);
                    } else {
                        navigate(
                            generatePath(
                                `${routes.regfbPage.path}?platformUserId=${res?.data?.platformUserId}&&code=${res?.data?.code}`,
                            ),
                            {
                                state: { action: 'home', prevPath: location.pathname },
                            },
                        );
                    }

                    // showSucsessMessage(translate.formatMessage(message.loginSuccess));
                }
            },
            onError: (res) => {},
        });
    };
    return {
        executeFBRegister: loginFaceBookFunc,
        loading: fbLoginloading,
    };
};

export default useLoginFB;
