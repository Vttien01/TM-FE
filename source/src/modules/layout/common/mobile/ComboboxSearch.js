import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import Container from '@components/common/elements/Container';
import classNames from 'classnames';
import styles from './ComboboxSearch.module.scss';
import useDebounce from '@hooks/useDebounce';
import useFetch from '@hooks/useFetch';
import apiConfig from '@constants/apiConfig';
import { useNavigate } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { useForm } from '@mantine/form';
import { appActions } from '@store/actions';
import { useDispatch } from 'react-redux';
import { useDisclosure } from '@mantine/hooks';
import { IconLoader2 } from '@tabler/icons-react';

export default function ComboboxSearch({ openedSearch, closeSearch }) {
    const navigate = useNavigate();

    const inputRef = useRef();
    const dispatch = useDispatch();
    const [ opened, handlers ] = useDisclosure(false);
    const queryParameters = new URLSearchParams(window.location.search);
    const query = queryParameters.get('query');
    const [ value, setValue ] = useState(query || '');
    const debouncedValue = useDebounce(value, 800);
    const [ searchResult, setSearchResult ] = useState([]);
    const options = searchResult?.slice(0, 5).map((item, index, array) => {
        const isLastItem = index === array.length - 1;
        return (
            <div
                key={item?.id}
                style={{ borderBottom: isLastItem ? 'none' : '1px solid #d1d7dc', borderRadius: '0' }}
            ></div>
        );
    });

    useEffect(() => {
        handlers.open();
        if (debouncedValue?.length == 0) {
            setSearchResult([]);
        } else {
            handeGetListCourse(debouncedValue);
        }
    }, [ debouncedValue ]);
    const { execute: executeCourse } = useFetch(apiConfig.course.getClientList, {
        mappingData: (res) => {
            if (!res?.data?.content) {
                setSearchResult([]);
            } else {
                setSearchResult(res?.data?.content);
            }
        },
    });
    const handeGetListCourse = (debouncedValue) => {
        executeCourse({
            params: { query: debouncedValue, size: 10 },
            onCompleted: (res) => {
                handlers.close();
            },
            onError: (error) => {
                handlers.close();
            },
        });
    };

    const form = useForm({
        initialValues: {
            searchValue: query || '',
        },
        validate: {},
    });
    const handleOnchange = (e) => {
        const searchValue = e.target.value;
        setValue(searchValue);
        if (!searchValue.startsWith(' ')) {
            form.setFieldValue('searchValue', e.target.value);
        }
    };
    useEffect(() => {
        if (query) {
            form.setFieldValue('searchValue', query);
            setValue(query);
        }
    }, [ query ]);
    const handleSubmit = (values) => {
        try {
            dispatch(appActions.setListSearch({}));
            navigate(`/search?query=${values?.searchValue}`);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            closeSearch();
        }
    };
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            dispatch(appActions.setListSearch({}));
            inputRef?.current?.blur();
            navigate(`/search?query=${value}`);
        }
    };

    return <Container className={styles.container}></Container>;
}
