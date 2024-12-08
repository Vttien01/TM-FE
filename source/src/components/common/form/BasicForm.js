import React from 'react';
import { Formik } from 'formik';

const BasicForm = ({ children, className = '', ref, id, style, ...rest }) => {
    return (
        <Formik {...rest}>
            {({ handleSubmit, ...renderFormProps }) => (
                <form ref={ref} id={id} className={className} onSubmit={handleSubmit} style={style}>
                    {typeof children === 'function' ? children(renderFormProps) : children}
                </form>
            )}
        </Formik>
    );
};

export default BasicForm;
