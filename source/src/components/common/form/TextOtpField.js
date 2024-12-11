import { Form, Input, Radio } from 'antd';
import React from 'react';
import useFormField from '@hooks/useFormField';
import TextArea from 'antd/es/input/TextArea';

const TextOtpField = (props) => {
    const {
        size,
        label,
        name,
        disabled,
        onBlur,
        validateStatus,
        help,
        style,
        className,
        onChange,
        readOnly,
        initialValue,
        length,
    } = props;

    const getMaxLengthMsg = () => {
        const { maxLength, maxLengthMsg } = props;
        return maxLengthMsg || `Số ký tự không thể nhiều hơn ${maxLength}`;
    };

    const getMinLengthMsg = () => {
        const { minLength, minLengthMsg } = props;
        return minLengthMsg || `Số ký tự không thể ít hơn ${minLength}`;
    };

    const getTextFieldRules = () => {
        const { maxLength, minLength, invalidEmailMsg } = props;
        const rules = [];
        if (maxLength) {
            rules.push({ max: maxLength, message: getMaxLengthMsg() });
        }
        if (minLength) {
            rules.push({ min: minLength, message: getMinLengthMsg() });
        }

        return rules;
    };

    const { rules, placeholder } = useFormField(props);
    return (
        <Form.Item
            className={className}
            label={label}
            name={name}
            validateStatus={validateStatus}
            initialValue={initialValue}
            help={help}
            rules={[ ...rules, getTextFieldRules() ]}
            labelCol={{ span: 24 }}
        >
            <Input.OTP
                onChange={onChange}
                style={style}
                size={size}
                placeholder={placeholder}
                disabled={disabled}
                onBlur={onBlur}
                readOnly={readOnly}
                length={length}
            />
        </Form.Item>
    );
};

export default TextOtpField;
