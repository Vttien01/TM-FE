// import useFormField from '@hooks/useFormField';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useFetch from '@hooks/useFetch';
function AutoCompleteLocationField({
    label,
    name,
    placeholder,
    rules,
    required,
    options,
    allowClear = true,
    fieldProps,
    apiConfig,
    mappingOptions,
    searchParams,
    optionsParams = {},
    maxOptions = 100,
    debounceTime = 1000,
    onChange,
    onSelect,
    form,
    ...props
}) {
    // const { placeholder: _placeholder, rules: _rules } = useFormField({
    //     placeholder,
    //     rules,
    //     required,
    // });

    const [ fetching, setFetching ] = useState(false);
    const [ _options, setOptions ] = useState([]);
    const { execute } = useFetch(apiConfig);
    const [ initialOpts, setInitialOpts ] = useState();
    return (
        <div></div>
    );
}

export default AutoCompleteLocationField;
