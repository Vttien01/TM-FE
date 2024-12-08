import React from 'react';
import { useField } from 'formik';
import classNames from 'classnames';

import styles from './InputField.module.scss';

const InputField = ({ style, label, className, classNameInput, type, onChange, ...props }) => {
    const [ field, meta, helpers ] = useField(props);

    const inputId = props.id || props.name;
    const hasError = meta.touched && meta.error;

    const onChangeValue = (evt) => {
        const value = evt.target.value;
        helpers?.setValue(value || '');
        onChange && onChange(value);
    };

    return (
        <div className={classNames(styles.inputField, hasError && styles.error, className)} style={style}>
            {label && <label htmlFor={inputId}>{label}</label>}
            {type === 'textarea' ? (
                <textarea type={type} id={inputId} {...field} {...props} onChange={onChangeValue} />
            ) : (
                <div className={classNameInput}>
                    <input type={type} id={inputId} {...field} {...props} onChange={onChangeValue} />
                </div>
            )}
            {/* {hasError && <div className={styles.error}>{meta.error}</div>} */}
        </div>
    );
};

export default InputField;
