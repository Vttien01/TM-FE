import React, { useEffect, useState } from 'react';
const useLoadMore = ( { dataAll, excute, params = {}, pathParams = {} } = {}) => {
    // console.log(dataAll);

    const [ activePage, setPage ] = useState(0);
    const [ data, setData ] = useState([]);

    const handleClick = () => {
        excute({
            params: { ...params },
        });
    };


    useEffect(() => {
        if (Array.isArray(dataAll?.content)) {
            setData(prevData => [ ...prevData, ...dataAll.content ]);
        } else {
            // Xử lý khi newsDataList không phải là mảng
            console.log("Lỗi");
        }
    }, [ dataAll ]);


    return {
        data, handleClick,
    };
};

export default useLoadMore;
