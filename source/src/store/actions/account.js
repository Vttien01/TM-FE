import { createAction, createSuccessActionType } from '@store/utils';

export const login = createAction('account/LOGIN');
export const loginSuccess = createAction(createSuccessActionType(login.type));
export const logout = createAction('account/LOGOUT');
export const getProfile = createAction('account/GET_PROFILE');
export const getSellerProfile = createAction('account/GET_PROFILE_SELLER');
export const getExpertProfile = createAction('account/GET_PROFILE_EXPERT');
export const getProfileSuccess = createAction(createSuccessActionType(getProfile.type));
export const getProfileSellerSuccess = createAction(createSuccessActionType(getSellerProfile.type));
export const getProfileExpertSuccess = createAction(createSuccessActionType(getExpertProfile.type));

export const requestForget = createAction('account/REQUEST_FORGET');
export const forgetPassword = createAction('account/FORGET_PASSWORD');
export const actions = {
    login,
    loginSuccess,
    getProfile,
    logout,
    getProfileSuccess,
    requestForget,
    forgetPassword,
    getSellerProfile,
    getProfileSellerSuccess,
    getExpertProfile,
    getProfileExpertSuccess,
};
