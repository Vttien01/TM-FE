import apiConfig from '@constants/apiConfig';
import useAuth from '@hooks/useAuth';
import useFetch from '@hooks/useFetch';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { appActions } from '@store/actions';
import { actions } from '@store/actions/app';
import { getCacheAccessToken } from '@services/userService';
import { getCartItemList } from '@store/actions/cart';

const InitRoute = () => {
    const { isAuthenticated } = useAuth();
    const dispatch = useDispatch();
    const userAccessToken = getCacheAccessToken();

    const {
        data: dataMyNotification,
        execute: executeGetDataMyNotification,
        loading: loadingDataMyNotification,
    } = useFetch(apiConfig.notification.myNotification, {
        immediate: false,
        mappingData: ({ data }) => {
            const pageTotal = data?.totalPages;
            const unReadTotal = data?.totalUnread;
            const listNotification = data?.content?.map((item) => {
                const msg = JSON.parse(item?.msg);
                return {
                    id: item?.id,
                    kind: item?.kind,
                    createdDate: item?.createdDate,
                    state: item?.state,
                    projectId: msg?.projectId,
                    taskName: msg?.taskName,
                    projectName: msg?.projectName,
                    courseId: msg?.courseId,
                    lectureName: msg?.lectureName,
                    courseName: msg?.courseName,
                };
            });
            return {
                pageTotal,
                unReadTotal,
                listNotification,
            };
        },
    });
    const { data: dataCategory, execute: executeGetCategorys } = useFetch(apiConfig.category.autocomplete, {
        immediate: false,
        mappingData: (data) => data.data.content,
    });
    const {
        execute: executeGetListCart,
        data: dataGetListCart,
        loading: dataListCartLoading,
    } = useFetch(apiConfig.cart.getList, {
        immediate: false,
    });
    useEffect(() => {
        if (isAuthenticated) {
            executeGetDataMyNotification();
            dispatch(actions.setNotification(dataMyNotification));
            executeGetCategorys({
                onCompleted: (response) => {
                    if (response?.data?.content?.length > 0) {
                        dispatch(actions.setCategory(response?.data?.content));
                    } else {
                        dispatch(actions.setCategory([]));
                    }
                },
                onError: () => {
                    // showErrorMessage('Không lấy được giả hàng!');
                    // form.resetFields();
                },
            });
            dispatch(actions.setCategory(dataCategory));
            executeGetListCart({
                onCompleted: (response) => {
                    if (response?.data?.cartDetailDtos?.length > 0) {
                        dispatch(getCartItemList(response?.data?.cartDetailDtos));
                    } else {
                        dispatch(getCartItemList([]));
                    }
                },
                onError: () => {
                    // showErrorMessage('Không lấy được giả hàng!');
                    // form.resetFields();
                },
            });
        }
    }, [ isAuthenticated ]);
    // useEffect(() => {
    //     if (dataMyNotification) {
    //         dispatch(actions.setNotification(dataMyNotification));
    //     }
    // }, [ dataMyNotification ]);
    return null;
};
export default InitRoute;
