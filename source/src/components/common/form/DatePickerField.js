import React, { useState } from 'react';
import { useField } from 'formik';
import classNames from 'classnames';
import styles from './InputField.module.scss';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
const DatePickerField = ({ label, className, classNameInput, onChange, handleDateSelect, date, ...props }) => {
    const [ field, meta, helpers ] = useField(props);
    const [ startDate, setStartDate ] = useState();
    const inputId = props.id || props.name;
    const hasError = meta.touched && meta.error;

    const onChangeValue = (evt) => {
        const value = evt;
        helpers?.setValue(value || '');
        onChange && onChange(value);
        setStartDate(evt);
    };

    return (
        <div className={classNames(styles.inputField, hasError && styles.error, className)}>
            {label && <label htmlFor={inputId}>{label}</label>}
            <div className={classNameInput}>
                <DatePicker
                    id={inputId}
                    selected={startDate} 
                    onSelect={onChangeValue} //when day is clicked
                    onChange={onChangeValue} //when day is clicked
                    {...props}
                />

                {/* <input type="date" id={inputId} {...field} {...props} onChange={onChangeValue} /> */}
            </div>
            {hasError && <div className={styles.error}>{meta.error}</div>}
        </div>
    );
};

export default DatePickerField;
