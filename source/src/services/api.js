import { httpStatus, storageKeys } from '@constants';
import apiConfig from '@constants/apiConfig';
import { removeItem } from '@utils/localStorage';
import axios from 'axios';
import {
    getCacheAccessToken,
    getCacheUserEmail,
    getCacheRefreshToken,
    removeCacheToken,
    setCacheToken,
} from './userService';
import { jwtDecode } from 'jwt-decode';

// Handle refresh token
const axiosInstance = axios.create();
let isRefreshing = false;
let subscribers = [];

const onRefreshed = (newAccessToken) => {
    subscribers.map((cb) => cb(newAccessToken));
};

const subscribeTokenRefresh = (cb) => {
    subscribers.push(cb);
};

axiosInstance.interceptors.response.use(
    (res) => res,
    async (err) => {
        const originalConfig = err.config;
        if (err.response?.data.code === 'ERROR-SELLER-0000' || err.response?.data.code === 'ERROR-STUDENT-0000') {
            removeCacheToken();
        }
        if (originalConfig.url !== apiConfig.account.login.baseURL && err.response) {


            if (err.response?.status === httpStatus.HTTP_UNAUTHORIZED && !originalConfig._retry) {

                removeCacheToken();
                // window.location.reload();

                // if (!getCacheRefreshToken()) {
                //     handleExpireAll();
                // }
                // originalConfig._retry = true;
                // return new Promise((resolve) => {
                //     subscribeTokenRefresh((newAccessToken) => {
                //         originalConfig.headers.Authorization = `Bearer ${newAccessToken}`;
                //         return resolve(axiosInstance(originalConfig));
                //     });
                // });
            }
            if (err.response?.status === httpStatus.HTTP_UNAUTHORIZED && !originalConfig._retry) {
                removeCacheToken();
                // window.location.reload();
            }
            // if (err.response?.status === httpStatus.HTTP_NOT_FOUND && !originalConfig._retry) {

            //     removeCacheToken();
            //     // window.location.reload();

            // }
            // Access Token was expired
            // if (err.response?.status === 401 && !originalConfig._retry) {
            //     const handleExpireAll = () => {
            //         removeCacheToken();
            //         window.location.reload();
            //     };
            //     if (!getCacheRefreshToken()) {
            //         handleExpireAll();
            //     }
            //     originalConfig._retry = true;
            //     if (!isRefreshing) {
            //         isRefreshing = true;
            //         const email = getCacheUserEmail();
            //         axiosInstance
            //             .post(apiConfig.account.refreshToken.baseURL, {
            //                 refreshToken: getCacheRefreshToken(),
            //                 email,
            //             })
            //             .then((rs) => {
            //                 const { accessToken, refreshToken } = rs.data.data;
            //                 setCacheToken(accessToken, refreshToken);
            //                 isRefreshing = false;
            //                 onRefreshed(accessToken);
            //                 subscribers = [];
            //             })
            //             .catch((_error) => {
            //                 handleExpireAll();
            //                 return Promise.reject(_error);
            //             });
            //     }
            //     return new Promise((resolve) => {
            //         subscribeTokenRefresh((newAccessToken) => {
            //             originalConfig.headers.Authorization = `Bearer ${newAccessToken}`;
            //             return resolve(axiosInstance(originalConfig));
            //         });
            //     });
            // }
        }
        return Promise.reject(err);
    },
);

const sendRequest = (options, payload, cancelToken) => {
    const { params = {}, pathParams = {}, data = {} } = payload;
    let { method, baseURL, headers, ignoreAuth, authorization } = options;
    const userAccessToken = getCacheAccessToken();
    if (userAccessToken) {
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const decodeAccessToken = jwtDecode(userAccessToken);
        if (decodeAccessToken?.exp < currentTimestamp) {
            removeCacheToken();
        }
    }
    if (!ignoreAuth && userAccessToken) {
        headers.Authorization = `Bearer ${userAccessToken}`;
    }
    // else
    if (headers.Authorization && !userAccessToken) {
        delete headers.Authorization;
    }

    if (authorization) {
        headers.Authorization = authorization;
    }

    if (params.token) {
        headers.Authorization = `Bearer ${params.token}`;
        delete params.token;
    }

    // update path params
    for (let key of Object.keys(pathParams)) {
        const keyCompare = `:${key}`;
        if (baseURL.indexOf(keyCompare) !== -1) {
            baseURL = baseURL.replace(keyCompare, pathParams[key]);
        }
    }

    // update path params
    for (let key of Object.keys(pathParams)) {
        const keyCompare = `:${key}`;
        if (baseURL.indexOf(keyCompare) !== -1) {
            baseURL = baseURL.replace(keyCompare, pathParams[key]);
        }
    }

    return axiosInstance.request({
        method,
        baseURL,
        headers,
        params,
        data,
        cancelToken,
    });
};

export { sendRequest };
