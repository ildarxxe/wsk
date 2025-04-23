import React from 'react';

const SelectFile = ({selectFile}) => {
    return (
        <div className={'selectFile'}>
            <input onChange={(e) => selectFile(e)} type="file" name="file" id="file" />
        </div>
    );
};

export default SelectFile;