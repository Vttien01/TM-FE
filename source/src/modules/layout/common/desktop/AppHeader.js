import React, { useEffect, useState } from 'react';
import styles from './AppHeader.module.scss';
import DefaultComponent from './Header/DefaultComponent';
import ModalForgetPassword from './ModalForgetPassword';
import ModalLogin from './ModalLogin';
import ModalRegister from './ModalRegister';
import { useDispatch, useSelector } from 'react-redux';
import { selectHeaderType, selectHeaderTypePreview } from '@selectors/app';
import classNames from 'classnames';
import useFetch from '@hooks/useFetch';
import apiConfig from '@constants/apiConfig';
import useFetchAction from '@hooks/useFetchAction';
import { accountActions, appActions } from '@store/actions';
import ModalFbRegister from '@modules/layout/desktop/landing/Login/ModalFbRegister';
import useTranslate from '@hooks/useTranslate';
import { hideAppLoginModal, showAppLoginModal } from '@store/actions/app';
import useAuth from '@hooks/useAuth';
const AppHeader = () => {
    const isDefaultHeader = useSelector(selectHeaderType);
    const { execute: executeGetProfile } = useFetchAction(accountActions.getProfile, {
        loading: useFetchAction.LOADING_TYPE.APP,
    });
    const [ openprofile, setOpenedProfile ] = useState(false);
    const [ dataFacebook, setDataFacebook ] = useState({});
    const queryParameters = new URLSearchParams(window.location.search);
    const translate = useTranslate();
    const dispatch = useDispatch();
    const openModalLogin = () => {
        dispatch(showAppLoginModal({}));
    };
    const closeModalLogin = () => {
        dispatch(appActions.setBuyCourseDirect(false));
        dispatch(appActions.setPayment(false));
        dispatch(hideAppLoginModal({}));
    };
    const appLogin = useSelector((state) => state.app.loginModal);
    const [ openProfileGG, setOpenedProfileGg ] = useState(false);
    const [ ggData, setGGData ] = useState({});
    const [ idCode, setIdCode ] = useState({});

    const { data: reviewData, execute: executeReviewData } = useFetch(apiConfig.review.myReview, {
        // immediate: true,
        mappingData: (res) => {
            return res?.data.content[0];
        },
    });

    return (
        <>
            <div id="header" className={classNames(styles.appHeader, !isDefaultHeader && styles.appHeaderDetail)}>
                <div style={{ display: 'flex', alignContent: 'center', height: '100%' }}>
                    <DefaultComponent />

                    {/* <CSSTransition
                        in={!isDefaultHeader}
                        // timeout={200}
                        classNames={{
                            enter: styles.detailEnter,
                            enterActive: styles.detailEnterActive,
                            exit: styles.detailExit,
                            exitActive: styles.detailExitActive,
                        }}
                        mountOnEnter
                        unmountOnExit
                    >
                        <DetailComponent reviewData={reviewData} executeReviewData={executeReviewData} isPreview={isPreview}/>
                    </CSSTransition>
                    <CSSTransition
                        in={isDefaultHeader}
                        // timeout={200}
                        classNames={{
                            enter: styles.detailEnter,
                            enterActive: styles.detailEnterActive,
                            exit: styles.detailExit,
                            exitActive: styles.detailExitActive,
                        }}
                        mountOnEnter
                        unmountOnExit
                    >
                        <DefaultComponent/>
                    </CSSTransition> */}
                </div>
                {/* <ModalProfile/> */}
                <ModalFbRegister
                    opened={openprofile}
                    close={() => setOpenedProfile(false)}
                    dataFacebook={dataFacebook}
                />
            </div>
        </>
    );
};

export default AppHeader;
