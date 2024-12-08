import { useState, useEffect } from 'react';

const useLoadmoreSearch = (initialData = []) => {
    const [ data, setData ] = useState(initialData);
    const [ page, setPage ] = useState(1);

    const handleLoadmore = (newData,isSetPage=false,initialPage = 1) => {
        
        if(!isSetPage){
            setData(newData);
            setPage(initialPage);
        }
        else{
            setData(prevData => [ ...prevData, ...newData ]);
            setPage(prevPage => prevPage + 1);
        }
    };

    useEffect(() => {
        return () => {
            setData([]);
            setPage(0);
        };
    }, []);

    return { data, page, handleLoadmore };
};

export default useLoadmoreSearch;
