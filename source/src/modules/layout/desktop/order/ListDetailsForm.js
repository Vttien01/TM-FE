import AutoCompleteField from '@components/common/form/AutoCompleteField';
import { BaseForm } from '@components/common/form/BaseForm';
import TextField from '@components/common/form/TextField';
import apiConfig from '@constants/apiConfig';
import { statusOptions } from '@constants/masterData';
import useAuth from '@hooks/useAuth';
import useFetch from '@hooks/useFetch';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { showErrorMessage } from '@services/notifyService';
import { Card, Col, Modal, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, defineMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

const messages = defineMessage({
    copyRight: '{brandName} - © Copyright {year}. All Rights Reserved',
    loginFail: 'Chưa điền đủ các trường thông tin!!!',
    login: 'Đăng nhập',
});

const ListDetailsForm = ({ open, onCancel, data, form, isEditing, executeGetMyAddress }) => {
    const [ cartItem, setCartItem ] = useState([]);
    const [ checkList, setCheckArray ] = useState(false);
    const [ skipFirstSubmit, setSkipFirstSubmit ] = useState(true);
    const translate = useTranslate();
    const statusValues = translate.formatKeys(statusOptions, [ 'label' ]);
    const navigate = useNavigate();
    const [ imageUrl, setImageUrl ] = useState(null);
    const { execute: executeUpdate } = useFetch(apiConfig.address.update);
    const { execute: executeCreate, loading } = useFetch({
        ...apiConfig.address.create,
    });
    const [ tableData, setTableData ] = useState([]);

    // Kiểm tra xem itemCart có tồn tại không trước khi sử dụng map
    const [ newArray, setnewArray ] = useState([]);
    const [ newArray1, setnewArray1 ] = useState([]);

    const [ cart, setCart ] = useState([]);
    const [ total, setTotal ] = useState(0);

    const [ province, setProvince ] = useState(null);
    const [ district, setDistrict ] = useState(null);

    useEffect(() => {
        if (data)
            form.setFieldsValue({
                ...data,
                provinceId: data?.provinceInfo?.id,
                districtId: data?.districtInfo?.id,
                wardId: data?.wardInfo?.id,
            });
    }, [ data ]);

    const onChange = (id, item) => {
        form.setFieldValue('provinceId', item);
    };

    const handleProvinceChange = (selectedValue, item) => {
        if (selectedValue === null) {
            setProvince(null);
            console.log(1);
        } else {
            setProvince(selectedValue);
            console.log(province);
        }
    };

    const handleDistrictChange = (selectedValue) => {
        if (selectedValue === null) {
            setDistrict(null);
            console.log(1);
        } else {
            setDistrict(selectedValue);
            console.log(province);
        }
        // Các xử lý khác dựa trên giá trị district
    };

    useEffect(() => {
        if (province !== null) {
            setDistrict(null);
        }
    }, [ province ]);

    useEffect(() => {
        if (skipFirstSubmit) {
            setSkipFirstSubmit(false);
            return;
        }
        setnewArray((prevArray) => prevArray.filter((item) => item.quantity !== 0));
        setCheckArray(false);
    }, [ checkList ]);

    const handleFinish = () => {
        const values = form.getFieldsValue();
        if (isEditing) {
            executeUpdate({
                data: { ...values, id: data.id },
                onCompleted: (res) => {
                    // setCacheAccessToken(res.access_token);
                    // executeGetProfile();
                    onCancel();
                    messages.success('Sửa địa chỉ thành công!');
                },
                onError: () => {
                    showErrorMessage(translate.formatMessage(messages.loginFail));
                    form.resetFields();
                },
            });
        } else {
            executeCreate({
                data: { ...values },
                onCompleted: (res) => {
                    executeGetMyAddress();
                    onCancel();
                    messages.success('Thêm địa chỉ thành công!');
                },
                onError: () => {
                    showErrorMessage(translate.formatMessage(messages.loginFail));
                    form.resetFields();
                },
            });
        }
        onCancel();
    };

    return (
        <Modal
            title={<FormattedMessage defaultMessage="Thêm địa chỉ nhận hàng" />}
            open={open}
            onCancel={onCancel}
            onOk={(e) => {
                e.stopPropagation();
                handleFinish();
            }}
            width={700}
        >
            <BaseForm form={form} size="100%">
                <Card style={{ width: 650 }}>
                    <Row gutter={24}>
                        <Col span={12}>
                            <TextField label={translate.formatMessage(commonMessage.Name)} name="name" />
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
                                required
                            />
                        </Col>
                        <Col span={12}>
                            <AutoCompleteField
                                label="Quận/Huyện"
                                name="districtId"
                                apiConfig={apiConfig.nation.autocomplete}
                                mappingOptions={(item) => ({ value: item.id, label: item.name })}
                                initialSearchParams={{ kind: 2 }}
                                searchParams={(text) => ({ name: text, kind: 2 })}
                                required
                                key={province}
                            />
                        </Col>
                        <Col span={12}>
                            <AutoCompleteField
                                label="Phường/Xã"
                                name="wardId"
                                apiConfig={apiConfig.nation.autocomplete}
                                mappingOptions={(item) => ({ value: item.id, label: item.name })}
                                initialSearchParams={{ kind: 3 }}
                                searchParams={(text) => ({ name: text, kind: 3 })}
                                required
                                key={district}
                            />
                        </Col>
                    </Row>
                    {/* <div className="footer-card-form">{actions}</div> */}
                </Card>
            </BaseForm>
        </Modal>
    );
};

export default ListDetailsForm;
