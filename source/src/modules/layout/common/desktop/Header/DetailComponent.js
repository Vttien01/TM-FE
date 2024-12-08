/* eslint-disable array-bracket-spacing */
import React, { useEffect, useState } from 'react';
import Container from '@components/common/elements/Container';
import { FormattedMessage } from 'react-intl';
import back from '@assets/icons/back.svg';
import { useNavigate, useParams } from 'react-router-dom';
import star from '@assets/icons/starIcon.svg';
import dots from '@assets/icons/dots.svg';
import avatar from '@assets/images/avatar_profile.png';
import BasicModal from '@components/common/form/BasicModal';
import useDisclosure from '@hooks/useDisclosure';
import useFetch from '@hooks/useFetch';
import apiConfig from '@constants/apiConfig';
import { reviewKind } from '@constants';
import useAuth from '@hooks/useAuth';
import { AppConstants } from '@constants';
import { showSucsessMessage } from '@services/notifyService';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@constants/intl';
// import TextField from '@components/common/form/TextField';
import ToolTips from '@components/common/elements/ToolTips';
import { ReactComponent as Star } from '@assets/icons/starIcon.svg';
import { ReactComponent as StarDone } from '@assets/icons/starIconDone.svg';

import { Form, Formik } from 'formik';
import { copyCourseToClipboard, copyToClipboard, limitCharacters } from '@utils';
import Typo from '@components/common/elements/Typo';
import classNames from 'classnames';

const DetailComponent = ({ style, reviewData, executeReviewData, isPreview }) => {
    const { id } = useParams();
    const translate = useTranslate();
    const navigate = useNavigate();
    const [checkModal, setCheckModal] = useState(1);
    const [review, setReview] = useState(false);
    const { profile } = useAuth();
    const [openedReview, { open: openReview, close: closeReview }] = useDisclosure(false);

    const params = useParams();
    const { execute: createReview, loading: loadingCreateReview } = useFetch(apiConfig.review.create);
    const handleCreateReview = (values) => {
        createReview({
            data: {
                ...values,
                kind: checkModal,
                courseId: params?.id,
                // ...(refcode && { referralCode: refcode }),
            },
            onCompleted: (res) => {
                showSucsessMessage('Đánh giá thành công');
                setReview(true);
                executeReviewData({
                    params: {
                        courseId: params?.id,
                        studentId: profile?.id,
                    },
                    mappingData: (res) => {
                        return res?.data.content;
                    },
                });

                closeReview();
            },
            onError: (error) => {
                // error?.response?.data?.code == EXPERT_REGISTRATION_ERROR_PHONE_OR_EMAIL_ALREADY_USED
                //     ? showErrorMessage(
                //         translate.formatMessage(errorMessage.EXPERT_REGISTRATION_ERROR_PHONE_OR_EMAIL_ALREADY_USED),
                //     )
                //     : '';
            },
        });
    };

    const { data: courseDetailData, execute: courseDetailExecute } = useFetch(apiConfig.course.getDetail);

    useEffect(() => {
        executeReviewData({
            params: {
                courseId: params?.id,
                studentId: profile?.id,
            },
            mappingData: (res) => {
                return res?.data.content[0];
            },
        });
        if (params?.id)
            courseDetailExecute({
                pathParams: {
                    id: params?.id,
                },
            });
    }, [params?.id]);

    return <div></div>;
};

export default DetailComponent;
