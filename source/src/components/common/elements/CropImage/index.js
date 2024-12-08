import AntdImgCrop from 'antd-img-crop';
import React, { useEffect, useState } from 'react';
import styles from './index.module.scss';
function CropImageLink({
    shape,
    url,
    onCompleted,
    onError,
    aspect,
    onModalCancel,
    show,
    uploadFileThumbnail,
    defaultImage,
    placeholder,
    required,
    className,
    preFix,
    bgColor,
    color,
    showRequired,
    showEditButton,
    name,
    srcIcon,
    ...props
}) {
    return (
        <div className={className}>
            <AntdImgCrop cropShape={shape} aspect={aspect} onModalCancel={onModalCancel}>
                <Component
                    uploadFileThumbnail={uploadFileThumbnail}
                    show={show}
                    url={url}
                    onError={onError}
                    onFinish={onCompleted}
                    defaultImage={defaultImage}
                    placeholder={placeholder}
                    required={required}
                    preFix={preFix}
                    bgColor={bgColor}
                    color={color}
                    showRequired={showRequired}
                    showEditButton={showEditButton}
                    name={name}
                    srcIcon={srcIcon}
                    {...props}
                />
            </AntdImgCrop>
        </div>
    );
}

const getFile = () => {
    document.getElementById('image-uploader').click();
};

function Component({
    bgColor,
    preFix,
    beforeUpload,
    onFinish,
    uploadFileThumbnail,
    defaultImage,
    placeholder,
    required,
    color,
    showRequired,
    showEditButton,
    name,
    srcIcon,
    ...props
}) {
    const [ isEdit, setEdit ] = useState(defaultImage && defaultImage !== '');
    useEffect(() => {
        if (defaultImage && defaultImage !== '') {
            const imageContainer = document.getElementById('image-container');
            imageContainer.style.display = 'none';
            const imagePreview = document.getElementById('image-result');
            imagePreview.style.display = 'block';
        }
    }, []);

    return (
        <>
            <div className={styles.wrapper}>
                <div
                    className={styles.round}
                    id="image-container"
                    onClick={getFile}
                    style={{ backgroundColor: bgColor, color: color }}
                >
                    {preFix && <img src={preFix} alt="" className={styles.preFix} />}
                    <span style={{ fontSize: '14px' }}> {placeholder}</span>
                </div>

                {required && showRequired && <Required />}
            </div>

            <input
                type="file"
                accept="image/png, image/jpeg"
                id="image-uploader"
                className={styles.imageUploader}
                onChange={async (e) => {
                    const files = Array.from(e.target.files)[0];
                    const filePreview = await beforeUpload(files, []);
                    try {
                        const imagePreview = document.getElementById('image-result');
                        const imageContainer = document.getElementById('image-container');
                        imagePreview.style.display = 'block';
                        imagePreview.src = URL.createObjectURL(filePreview);
                        await uploadFileThumbnail(filePreview);
                        imageContainer.style.display = 'none';
                        setEdit(true);
                        onFinish?.(filePreview);
                    } catch (error) {
                        console.log(error);
                    }
                }}
            />
            <div className={styles.imagePreviewContaier}>
                <img
                    id="image-result"
                    className={styles.imagePreview}
                    src={defaultImage}
                    height="150"
                    alt="Image preview"
                    onClick={getFile}
                />
                {srcIcon && <img src={srcIcon} onClick={getFile} className={styles.editIcon} />}
            </div>
        </>
    );
}

const Required = () => {
    return <span style={{ color: 'red', fontSize: '18px', fontWeight: 'bold' }}>*</span>;
};

export default CropImageLink;
