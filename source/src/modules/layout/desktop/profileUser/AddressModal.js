import AutoCompleteField from '@components/common/form/AutoCompleteField';
import TextField from '@components/common/form/TextField';
import apiConfig from '@constants/apiConfig';
import useAuth from '@hooks/useAuth';
import useFetch from '@hooks/useFetch';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { showErrorMessage, showSucsessMessage } from '@services/notifyService';
import { Button, Col, Flex, Form, InputNumber, Modal, Row, Table } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { FormattedMessage, defineMessage, defineMessages } from 'react-intl';
import { useNavigate } from 'react-router-dom';

const message = defineMessages({
    copyRight: '{brandName} - © Copyright {year}. All Rights Reserved',
    loginFail: 'Chưa điền đủ các trường thông tin!!!',
    login: 'Đăng nhập',
    updateSuccess: 'Cập nhật thành công',
    updateFail: 'Cập nhật thất bại',
    createSuccess: 'Tạo mới thành công',
    createFail: 'Tạo mới thất bại',
});

const AddressModal = ({ open, onCancel, address, form, getList }) => {
    const navigate = useNavigate();
    const translate = useTranslate();
    const [ province, setProvince ] = useState(null);
    const [ district, setDistrict ] = useState(null);
    const titleModal = useMemo(() => {
        return address ? 'Cập nhật địa chỉ' : 'Thêm mới địa chỉ';
    }, [ address ]);
    const { execute, loading } = useFetch(address ? apiConfig.address.update : apiConfig.address.create, {
        immediate: false,
    });
    useEffect(() => {
        if (address) {
            form.setFieldsValue({
                ...address,
                provinceId: address?.provinceInfo?.id,
                districtId: address?.districtInfo?.id,
                wardId: address?.wardInfo?.id,
            });
        }
    }, [ address ]);
    const handleAddressModal = () => {
        const data = form.getFieldsValue();
        execute({
            data: { ...data, id: address?.id },
            onCompleted: (res) => {
                onCancel();
                getList();
                showSucsessMessage(
                    address
                        ? translate.formatMessage(message.updateSuccess)
                        : translate.formatMessage(message.createSuccess),
                );
            },
            onErrorr: (err) => {
                onCancel();
                showErrorMessage(
                    address ? translate.formatMessage(message.updateFail) : translate.formatMessage(message.createFail),
                );
            },
        });
    };

    const handleProvinceChange = (selectedValue) => {
        if (selectedValue === null) {
            setProvince(null);
        } else {
            setProvince(selectedValue);
        }
    };

    const handleDistrictChange = (selectedValue) => {
        if (selectedValue === null) {
            setDistrict(null);
        } else {
            setDistrict(selectedValue);
        }
    };

    useEffect(() => {
        if (province !== null) {
            setDistrict(null);
        }
    }, [ province ]);
    return (
        <Modal
            title={titleModal}
            open={open}
            onCancel={onCancel}
            // onOk={() => form.submit()}
            width={'50vw'}
            footer={
                <Flex width="100%" justify="flex-end" gap="middle">
                    <Button key="cancel" onClick={onCancel}>
                        Đóng
                    </Button>
                    <Button
                        key="ok"
                        type="primary"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleAddressModal();
                        }}
                        loading={loading}
                    >
                        {address ? 'Cập nhật' : 'Tạo mới'}
                    </Button>
                </Flex>
            }
        >
            <Form form={form} style={{ width: '100%' }}>
                <Row gutter={12}>
                    <Col span={12}>
                        <TextField label={translate.formatMessage(commonMessage.fullName)} name="name" />
                    </Col>
                    <Col span={12}>
                        <TextField label={translate.formatMessage(commonMessage.phone)} name="phone" />
                    </Col>
                    <Col span={12}>
                        <TextField label={translate.formatMessage(commonMessage.address)} name="address" />
                    </Col>
                    <Col span={12}>
                        <AutoCompleteField
                            label="Tỉnh/Thành phố"
                            name="provinceId"
                            apiConfig={apiConfig.nation.autocomplete}
                            mappingOptions={(item) => ({ value: item.id, label: item.name })}
                            initialSearchParams={{ kind: 1 }}
                            searchParams={(text) => ({ name: text, kind: 1 })}
                            onChange={handleProvinceChange}
                            required
                            labelCol={{ span: 24 }}
                        />
                    </Col>
                    <Col span={12}>
                        <AutoCompleteField
                            label="Quận/Huyện"
                            name="districtId"
                            apiConfig={apiConfig.nation.autocomplete}
                            mappingOptions={(item) => ({ value: item.id, label: item.name })}
                            initialSearchParams={{ parentId: province, kind: 2 }}
                            searchParams={(text) => ({ name: text, kind: 2 })}
                            required
                            key={province}
                            labelCol={{ span: 24 }}
                        />
                    </Col>
                    <Col span={12}>
                        <AutoCompleteField
                            label="Phường/Xã"
                            name="wardId"
                            apiConfig={apiConfig.nation.autocomplete}
                            mappingOptions={(item) => ({ value: item.id, label: item.name })}
                            initialSearchParams={{ parentId: district, kind: 3 }}
                            searchParams={(text) => ({ name: text, kind: 3 })}
                            required
                            key={district}
                            labelCol={{ span: 24 }}
                        />
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default AddressModal;
