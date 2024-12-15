import React from 'react';

import useFormField from '@hooks/useFormField';
import { Form, Input } from 'antd';

const InputTextField = ({
    label = '',
    name = '',
    className,
    formItemProps,
    fieldProps,
    size,
    type,
    style,
    value,
    ...props
}) => {
    const { rules, placeholder } = useFormField(props);

    return (
        <Form.Item label={label} name={name} validateFirst rules={rules} {...formItemProps}>
            <Input
                {...fieldProps}
                className={className}
                placeholder={placeholder}
                size={size}
                type={'textarea'}
                style={style}
                defaultValue={value}
            />
        </Form.Item>
    );
};

export default InputTextField;
