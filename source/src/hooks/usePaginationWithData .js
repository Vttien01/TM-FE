import { useState, useEffect } from 'react';

const usePaginationWithData = (initialData = [], id, checked) => {
    const [ data, setData ] = useState(initialData);
    const [ page, setPage ] = useState(0);

    const handlePagination = (newData) => {
        setData(prevData => [ ...prevData, ...newData ]);
        setPage(prevPage => prevPage + 1);
    };

    useEffect(() => {
        if (checked) {
            setData([]);
            setPage(0);
        }
    }, [ id ]);

    return { data, page, handlePagination, setData };
};

export default usePaginationWithData;
