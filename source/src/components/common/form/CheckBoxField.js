import React from 'react';
import { useField } from 'formik';
import classNames from 'classnames';

import styles from './CheckBoxField.module.scss';

const CheckBoxField = ({
    children,
    name,
    disabled,
    className,
    checkboxCenter = true,
    onChange,
    ...rest
}) => {
    const [ field, meta ] = useField({ name });

    const handleChange = e => {
        console.log({ field });
        field.onChange(e);
        onChange?.(e);
    };

    return (
        <label
            className={classNames(
                className,
                styles.checkboxField,
                meta.touched && meta.error && styles.error,
                checkboxCenter && styles.checkboxCenter,
            )}
        >
            <input
                type="checkbox"
                name={name}
                {...field}
                checked={field.value}
                {...rest}
                onChange={handleChange}
                disabled={disabled}
            />
            <span className={styles.checkmark} />
            {children}
            {/* {meta.touched && meta.error && (
					<div className="input-feedback">{meta.error}</div>
			)} */}
        </label>
    );
};

export default CheckBoxField;
