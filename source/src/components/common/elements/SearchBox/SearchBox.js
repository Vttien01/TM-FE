import { ClearOutlined } from '@ant-design/icons';
import apiConfig from '@constants/apiConfig';
import useFetch from '@hooks/useFetch';
import { IconSearch } from '@tabler/icons-react';
import { Avatar, Button, Select, Space, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { defineMessages } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import './SearchBox.scss';
import useFetchDataHook from './useFetchDataHook';
const { Option } = Select;

const message = defineMessages({
    objectName: 'profile',
});

const SearchBox = () => {
    const navigate = useNavigate();

    const [ keyword, setKeyword ] = useState('');
    const [ getData, getTotal, isLoading, isLoadSuccess, isLoadError, clearSearch, handleSearch, handleLoadMore ] =
        useFetchDataHook(keyword);
    useEffect(() => {
        document.title = 'Home';
    }, []);

    function handleClearSearch() {
        setKeyword('');
        clearSearch();
    }
    const SearchInput = (props) => {
        const { data: dataProduct, execute: excuteDataProduct } = useFetch({
            ...apiConfig.product.autocomplete,
        });
        const [ data, setData ] = useState([]);
        const [ value, setValue ] = useState();
        const handleSearch = (newValue) => {
            excuteDataProduct({
                params: { name: newValue },
                onCompleted: (response) => {
                    const data = response.data.map((item) => ({
                        value: item.id,
                        text: item,
                    }));
                    setData(data);
                },
            });
        };

        const handleChange = (newValue) => {
            navigate(`/detail/${newValue}`);
        };
        return (
            <Select
                showSearch
                value={value}
                placeholder={props.placeholder}
                style={props.style}
                suffixIcon={<IconSearch />}
                filterOption={false}
                onSearch={handleSearch}
                onChange={handleChange}
                notFoundContent={null}
                optionLabelProp="label"
                dropdownRender={(menu) => <div>{menu}</div>}
            >
                {(data || []).map((d) => (
                    <Option key={d.value} value={d.value} label={d.text}>
                        <Space direction="horizontal" style={{ marginTop: 10, backgroundColor: '282a36' }}>
                            <Avatar src={d.text.image} size={48} />
                            <Space direction="vertical">
                                <Typography.Title level={4}>{d.text.name}</Typography.Title>
                                <Typography.Text>Số lượng:{d.text.totalInStock}</Typography.Text>
                            </Space>
                        </Space>
                    </Option>
                ))}
            </Select>
        );
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            <SearchInput
                placeholder="Tìm kiếm"
                style={{
                    width: '100%',
                    height: 40,
                }}
            />
            <Button className="ml-2" style={{ marginLeft: 8 }} icon={<ClearOutlined />} onClick={handleClearSearch}>
                Clear
            </Button>
        </div>
    );
};
export default SearchBox;
