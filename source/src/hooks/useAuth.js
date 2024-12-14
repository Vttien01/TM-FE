import { useSelector } from 'react-redux';

import accountSelectors from '@selectors/account';
import useFetchAction from './useFetchAction';
import { accountActions } from '@store/actions';
import useActionLoading from './useActionLoading';
import { getCacheAccessToken } from '@services/userService';
import { UserTypes } from '@constants';
import { useCallback } from 'react';

const useAuth = () => {
    const profile = useSelector(accountSelectors.selectProfile);
    const token = getCacheAccessToken();

    const immediate = !!token && !profile;

    useFetchAction(accountActions.getProfile, { immediate });

    const { loading } = useActionLoading(accountActions.getProfile.type);

    const permissions = profile?.group?.permissions?.map((permission) => permission.action);
    const kind = profile?.account?.kind;
    const memberShip = profile?.account?.memberShip;

    return {
        memberShip,
        isAuthenticated: !!profile,
        profile,
        kind,
        permissions,
        token,
        loading: immediate || loading,
    };
};

export default useAuth;
