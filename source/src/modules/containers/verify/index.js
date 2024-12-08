import { GROUP_KIND_EXPERT, storageKeys } from '@constants';
import apiConfig from '@constants/apiConfig';
import useQueryParams from '@hooks/useQueryParams';
import routes from '@routes';
import { setCacheAccessToken } from '@services/userService';
import { setData } from '@utils/localStorage';
import React, { useEffect } from 'react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';

const VerifyPage = () => {
    const { id } = useParams();
    const { params } = useQueryParams();
    const navigate = useNavigate();
    useEffect(() => {
        if (params.get('accessToken')) {
            setData(storageKeys.IGNORE_AUTH,true);
            setCacheAccessToken(params.get('accessToken'));
            navigate(generatePath(routes.previewCourseDetail.path, { id }));
        }
    }, []);
    return <div>VerifyPage</div>;
};

export default VerifyPage;
