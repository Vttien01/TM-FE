import { useField } from 'formik';
import React from 'react';
import Select from 'react-select';
import classNames from 'classnames';
import styles from './InputField.module.scss';

const DropDownField = ({ label, className, classNameInput, onChange, options, isMulti, ...props }) => {
    const [ meta ] = useField(props);

    const inputId = props.id || props.name;
    const hasError = meta.touched && meta.error;
    return (
        <div className={classNames(styles.inputField, hasError && styles.error, className)}>
            {label && <label htmlFor={inputId}>{label}</label>}
            <div className={classNameInput}>
                <Select id={inputId} options={options} {...props} isMulti={isMulti || false} />
            </div>
        </div>
    );
};

export default DropDownField;
