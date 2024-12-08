import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import styles from './SearchResult.module.scss';
import Typo from '@components/common/elements/Typo';
import Container from '@components/common/elements/Container';
import useLoadmoreSearch from '@hooks/useLoadmoreSearch';
import { FormattedMessage } from 'react-intl';
import qs from 'query-string';
import { useDispatch } from 'react-redux';
import { appActions } from '@store/actions';

const SearchResult = ({ form,courseList, searchValue, closeSearch, executeCourse }) => {
    const [ loadmore, setLoadmore ] = useState(false);
    const currentParams = qs.parse(location.search);
    const dispatch = useDispatch();
    const queryParameters = new URLSearchParams(window.location.search);
    const query = queryParameters.get('query');
    const { data, page, handleLoadmore } = useLoadmoreSearch();
    const handleClick = () => {
        setLoadmore(true);
        executeCourse({
            params: {  ...currentParams, page, size: 10 },
        });
    };

    useEffect(() => {
        if (Array.isArray(courseList?.content) && loadmore) {
            handleLoadmore(courseList.content,true);
            setLoadmore(false);
        } else if(Array.isArray(courseList?.content)) {
            handleLoadmore(courseList.content,false,courseList?.page);
        }
        else if(courseList?.totalElements==0){
            handleLoadmore([],false);
        }
    }, [ courseList ]);
    useEffect(() => {
        if(data){
            dispatch(appActions.setListSearch({ data: {
                content: data,
                totalPages:courseList?.totalPages,
                page,
            }, page }));
        }
    }, [ data ]);


    return (
        <div className={classNames(styles.landingPage)}>
            <div className={styles.headerSearch}>
                {searchValue == '' ? (
                    <Container>
                        <Typo size="primary" type="semi-bold" style={{ paddingTop: '1rem' }}>
                            <FormattedMessage defaultMessage="Vui lòng nhập từ khoá tìm kiếm" />
                        </Typo> 
                    </Container>
                ):(
                    <Container>
                        { courseList?.length == 0 ? (
                            <Typo size="primary" type="semi-bold" style={{ paddingTop: '1rem' }}>
                                0 Kết quả cho &ldquo;{searchValue}&ldquo;
                            </Typo> 
                        ):(
                            <Typo size="primary" type="semi-bold" style={{ paddingTop: '1rem' }}>
                                {data?.length || 0} Kết quả cho &ldquo;{searchValue}&ldquo;
                            </Typo>
                        )}
                    
                    </Container>
                )}
            </div>

            <div className={'container'}>
            </div>
        </div>
    );
};

export default SearchResult;
