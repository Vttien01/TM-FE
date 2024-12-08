import React from 'react';
import { useField } from 'formik';
import classNames from 'classnames';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import styles from './InputField.module.scss';

const InputSliderField = ({ label, className, classNameInput, onChange, min, max, handle, ...props }) => {
    const [ field, meta, helpers ] = useField(props);

    const inputId = props.id || props.name;
    const hasError = meta.touched && meta.error;

    return (
        <div className={classNames(styles.inputField, hasError && styles.error, className)}>
            {label && <label htmlFor={inputId}>{label}</label>}
            <div className={classNameInput}>
                <Slider id={inputId} min={min || 0} max={max || 100} handle={handle} {...props} />
            </div>
            {/* {hasError && <div className={styles.error}>{meta.error}</div>} */}
        </div>
    );
};

export default InputSliderField;
