import useTranslate from '@hooks/useTranslate';
import { IconSearch } from '@tabler/icons-react';
import React, { useEffect, useRef, useState } from 'react';
import { defineMessages } from 'react-intl';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import styles from './SearchBar.module.scss';
import classNames from 'classnames';
import useDebounce from '@hooks/useDebounce';
import useFetch from '@hooks/useFetch';
import apiConfig from '@constants/apiConfig';
import SearchResult from './SearchResult';
import useQueryParams from '@hooks/useQueryParams';
import { appActions } from '@store/actions';
import { useDispatch, useSelector } from 'react-redux';
import { selectAppListSearchs } from '@selectors/app';
import routes from '@routes';
import Container from '@components/common/elements/Container';
const message = defineMessages({
    inputSearch: 'Nhập từ khoá...',
});
const SearchBar = ({ openedSearch, openSearch, closeSearch }) => {
    const inputRef = useRef();
    const dataList = useSelector(selectAppListSearchs);
    const { setQueryParams } = useQueryParams();
    const dispatch = useDispatch();
    const queryParameters = new URLSearchParams(window.location.search);
    const query = queryParameters.get('query');
    const [ searchResult, setSearchResult ] = useState([]);
    const [ searchValue, setSearchValue ] = useState(query || '');
    const debouncedValue = useDebounce(searchValue, 800);

    const translate = useTranslate();
    const navigate = useNavigate();

    const handleSubmit = (values) => {
        try {
            navigate(`/search?query=${values?.searchValue}`);
            dispatch(appActions.setListSearch({}));
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            closeSearch();
        }
    };

    const handleOnchange = (e) => {
        const searchValue = e.target.value;
        setSearchValue(searchValue);
        if (!searchValue.startsWith(' ')) {
            console.log(searchValue);
        }
        if (!searchValue) {
            setQueryParams({});
        }
    };
    const { data: courseList, execute: executeCourse } = useFetch(apiConfig.course.getClientList, {
        mappingData: (res) => setSearchResult(res),
    });
    const handeGetListCourse = (debouncedValue) => {
        executeCourse({
            params: { query: debouncedValue, size: 10 },
            onCompleted: (res) => {
                setQueryParams({ query: debouncedValue });
            },
            onError: (error) => {},
        });
    };
    useEffect(() => {
        if (debouncedValue?.length == 0) {
            setSearchResult([]);
        } else {
            handeGetListCourse(debouncedValue);
        }
    }, [ debouncedValue ]);
    useEffect(() => {
        if (query) {
            openSearch();
            handeGetListCourse(query);
        }
    }, []);
    return <div></div>;
};
export default SearchBar;
