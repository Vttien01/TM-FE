import React from 'react';
import { useField } from 'formik';
import classNames from 'classnames';

import styles from './InputField.module.scss';

const TextareaField = ({ label, className, classNameInput, onChange,  ...props }) => {
    const [ field, meta, helpers ] = useField(props);

    const inputId = props.id || props.name;
    const hasError = meta.touched && meta.error;

    const onChangeValue = (evt) => {
        const value = evt.target.value;
        helpers?.setValue(value || '');
        onChange && onChange(value);
    };

    return (
        <div className={classNames(styles.inputField, hasError && styles.error, className)}>
            {label && <label htmlFor={inputId}>{label}</label>}
            <div className={classNameInput}>
                <textarea id={inputId} {...field} {...props} onChange={onChangeValue}></textarea>
            </div>
            {hasError && <div className={styles.error}>{meta.error}</div>}
        </div>
    );
};

export default TextareaField;
