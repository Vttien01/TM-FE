import { takeLatest } from 'redux-saga/effects';
import { accountActions } from '@store/actions';
import { processAction } from '@store/utils';
import apiConfig from '@constants/apiConfig';

const loginSaga = (payload) => processAction(apiConfig.account.login, payload);

const getProfileSaga = (payload) => processAction(apiConfig.user.getProfile, payload);
const getProfileSellerSaga = (payload) => processAction(apiConfig.account.getSellerProfile, payload);
const getProfileExpertSaga = (payload) => processAction(apiConfig.account.getExpertProfile, payload);

const sagas = [
    takeLatest(accountActions.login.type, loginSaga),
    takeLatest(accountActions.getProfile.type, getProfileSaga),
    takeLatest(accountActions.getSellerProfile.type, getProfileSellerSaga),
    takeLatest(accountActions.getExpertProfile.type, getProfileExpertSaga),
];

export default sagas;
