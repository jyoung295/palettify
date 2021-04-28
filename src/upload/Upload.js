import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react'
import './Upload.scss';

const MAX_FILE_SIZE_BYTES = 5000000

const Upload = ({
    collectFile,
    maxFileSize = MAX_FILE_SIZE_BYTES
}) => {

    const [hasSizeError, setHasSizeError] = useState(false);
    const [hasTypeError, setHasTypeError] = useState(false);

    const handleFileUpload = (e) => {
        setHasSizeError(false)
        setHasTypeError(false)

        const newFile = e.target.files[0]

        if (newFile.size > maxFileSize) {
            setHasSizeError(true)
        } else if (newFile.type !== "image/jpeg" && newFile.type !== "image/png") {
            setHasTypeError(true)
        } else {
            setHasSizeError(false)
            setHasTypeError(false)
            collectFile(newFile)
        }
    }

    return (
        <>
            <FontAwesomeIcon icon="file-upload" size="5x" />

            {hasSizeError && (
                <p className="hasError">Your photo was too large! Please choose another under 5mb.</p>
            )}

            {hasTypeError && (
                <p className="hasError">Please upload only JPEG or PNG files.</p>
            )}

            {!hasSizeError && !hasTypeError && (
                <p>Drop your photo here, or <strong>Browse</strong></p>
            )}
            
            <span>Supports JPG, PNG. Max File Size: 5mb</span>
            <input className="file-uploader__input" type="file" accept="image/png, image/jpeg" onChange={handleFileUpload}/>
        </>
    )
}


export default Upload