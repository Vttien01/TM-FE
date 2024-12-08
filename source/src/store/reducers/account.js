import { createFailureActionType, createReducer } from '@store/utils';
import { accountActions } from '@store/actions';
import { showSucsessMessage } from '@services/notifyService';
import { ERROR_STUDENT_0001 } from '@constants/ErrorCode';
import { removeCacheToken } from '@services/userService';

const { logout, getProfileSuccess, getProfile, getProfileSellerSuccess, getProfileExpertSuccess } = accountActions;

const initialState = {
    profile: null,
};

const accountReducer = createReducer(
    {
        reducerName: 'account',
        initialState,
        // storage: true,
        storage: false,
    },
    {
        [getProfileSuccess.type]: (state, { payload }) => {
            state.profile = payload?.data || null;
        },
        [getProfileSellerSuccess.type]: (state, { payload }) => {
            state.profile = payload?.data || null;
        },
        [getProfileExpertSuccess.type]: (state, { payload }) => {
            state.profile = payload?.data || null;
        },
        [createFailureActionType(getProfile.type)]: (state, { payload }) => {
            console.log({ payload });
            if (payload.response.data.code === ERROR_STUDENT_0001) {
                removeCacheToken();
            }
        },
        [logout.type]: (state) => {
            state.profile = null;
            // showSucsessMessage('Đăng xuất thành công');
        },
    },
);

export default accountReducer;
