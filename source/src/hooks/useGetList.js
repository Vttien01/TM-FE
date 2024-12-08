import React, { useCallback, useState } from "react";
import { sendRequest } from "@services/api";
import { useQuery } from "@tanstack/react-query";


function useGetList( apiConfig, { mappingData, params = {}, pathParams = {},queryKey, options } = {}) {
    const execute = useCallback(
        async ({ onCompleted, onError, ...payload } = {}, cancelType) => {

            try {
                const { data } = await sendRequest(apiConfig, { params, pathParams, ...payload }, cancelType);
                if (!data.result && data.statusCode !== 200) {
                    throw data;
                }
                onCompleted && onCompleted(data);
                return mappingData ? mappingData(data) : data;
            } catch (error) {
                onError && onError(error);
                return error;
            } 
        },
        [ apiConfig ],
    );
    
    const getListQuery = useQuery({
        queryKey: queryKey,
        queryFn: execute,
        cacheTime: Infinity,
        refetchOnWindowFocus: false,
        staleTime: Infinity,
        refetchInterval: false,
        ...options,
    });
    

    return getListQuery;
}

export default useGetList;
