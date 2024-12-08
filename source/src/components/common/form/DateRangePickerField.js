import React, { useState } from 'react';
import { useField } from 'formik';
import classNames from 'classnames';
import styles from './InputField.module.scss';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
const DateRangePickerField = ({ label, className, classNameInput, onChange, handleDateSelect, date, ...props }) => {
    const [ field, meta, helpers ] = useField(props);
    const [ dateRange, setDateRange ] = useState([ null, null ]);
    const [ startDate, endDate ] = dateRange;
    const inputId = props.id || props.name;
    const hasError = meta.touched && meta.error;

    const onChangeValue = (evt) => {
        const value = evt;
        helpers?.setValue(value || '');
        onChange && onChange(value);
        setDateRange(evt);
    };

    return (
        <div className={classNames(styles.inputField, hasError && styles.error, className)}>
            {label && <label htmlFor={inputId}>{label}</label>}
            <div className={classNameInput}>
                <DatePicker
                    id={inputId}
                    selectsRange={true}
                    startDate={startDate}
                    endDate={endDate}
                    onChange={onChangeValue}
                    isClearable={true}
                    {...props}
                />

                {/* <input type="date" id={inputId} {...field} {...props} onChange={onChangeValue} /> */}
            </div>
            {hasError && <div className={styles.error}>{meta.error}</div>}
        </div>
    );
};

export default DateRangePickerField;
