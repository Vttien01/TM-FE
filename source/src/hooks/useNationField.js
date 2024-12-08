import apiConfig from '@constants/apiConfig';
import useFetch from '@hooks/useFetch';
import React, { useEffect, useState } from 'react';
import { useCallback } from 'react';
function useNationField({ form, initialData }) {
    const [ provincesOpts, setProvincesOpts ] = useState([]);
    const [ districtsOpts, setDistrictsOpts ] = useState([]);
    // const [ parentIdOfDistrict, setParentIdOfDistrict ] = useState();
    // const [ parentIdOfWard, setParentIdOfWard ] = useState();
    // const [ disabledWard, setDisableWard ] = useState(false);
    const [ wardsOpts, setWardsOpts ] = useState([]);
    const { execute: executeGetNation, loading: getNationLoading } = useFetch(apiConfig.nation.autocomplete);
    const handleGetNation = (setOpts, kind, parentId) => {
        executeGetNation({
            params: {
                kind,
                parentId,
            },
            onCompleted: (res) => {
                setOpts(
                    res.data?.content?.map((item) => ({
                        label: item.name,
                        value: `${item.id}`,
                    })),
                );
            },
        });
    };

    const handleGetProvinces = (id, clearChildOpts) => {
        handleGetNation(setProvincesOpts, 1, id);
        if (clearChildOpts) {
            setDistrictsOpts([]);
            setWardsOpts([]);
        }
    };

    const handleGetWards = (id, parentId) => {
        setWardsOpts([]);
        handleGetNation(setWardsOpts, id, parentId);
    };

    const handleGetDistricts = (id, parentId, clearChildOpts) => {
        setDistrictsOpts([]);
        handleGetNation(setDistrictsOpts, id, parentId);
        if (clearChildOpts) {
            setWardsOpts([]);
        }
    };

    const resetField = () => {
        form.setValues({
            provinceId: '',
            districtId: '',
            wardId: '',
        });
        setProvincesOpts([]);
        setDistrictsOpts([]);
        setWardsOpts([]);
    };

    const baseFieldProps = {
        mappingOptions: (item) => ({
            label: item.name,
            value: item.id,
        }),
        apiConfig: apiConfig.nation.autocomplete,
    };

    const provincesFieldProps = {
        ...baseFieldProps,
        searchParams: (text) => ({ name: text }),
        options: provincesOpts,
        onChange: (id) => {
            if (id) handleGetDistricts(null, id, true);
            else handleGetProvinces(id, true);
            form.setValues({
                provinceId: id,
                districtId: null,
                wardId: null,
            });
        },
    };

    const handleGetLabelById = useCallback((id, options = []) => {
        return options.find((item) => item.value === id)?.label ?? '';
    }, []);

    const districtsFieldProps = {
        ...baseFieldProps,
        options: districtsOpts,
        searchParams: (text) => ({ name: text, parentId: form.values['provinceId'] }),
        onChange: (id) => {
            if (id) handleGetWards(null, id);
            else handleGetDistricts(id, form.values['provinceId'], true);
            form.setValues({
                districtId: id,
                wardId: null,
            });
        },
    };

    const wardsFieldProps = {
        ...baseFieldProps,
        options: wardsOpts,
        searchParams: (text) => ({ name: text, parentId: form.values['districtId'] }),
        onChange: (id) => {
            if (!id) handleGetWards(id, form.values['districtId']);
            form.setValues({
                wardId: id,
            });
        },
    };

    useEffect(() => {
        if (provincesOpts.length === 0) {
            handleGetProvinces(null, true);
            form.setValues({
                provinceId: initialData?.provinceId,
            });
        }
        if (initialData?.wardId && wardsOpts.length === 0) {
            handleGetWards(null, initialData?.districtId);
            form.setValues({
                wardId: initialData?.wardId,
            });
        }
        if (initialData?.districtId && districtsOpts.length === 0) {
            handleGetDistricts(null, initialData?.provinceId);
            form.setValues({
                districtId: initialData?.districtId,
            });
        }
    }, [ initialData ]);

    return {
        provincesOpts,
        districtsOpts,
        wardsOpts,
        // getNationLoading,
        handleGetProvinces,
        handleGetWards,
        handleGetDistricts,
        provincesFieldProps,
        wardsFieldProps,
        districtsFieldProps,
        resetField,
    };
}

export default useNationField;
