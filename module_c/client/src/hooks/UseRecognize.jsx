import React, {useCallback, useEffect, useState} from 'react';

export const UseRecognize = () => {
    const [recSuccess, setRecSuccess] = useState(false);
    const [recDialog, setRecDialog] = React.useState([]);
    const [fileName, setFileName] = React.useState("");

    const fetchRecognize = useCallback(async (file) => {
        const data = new FormData();
        data.append("image", file);
        const res = await fetch('http://127.0.0.1:8000/api/recognize', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: data
        })
        return res.json();
    }, [])

    const selectFile = React.useCallback(async (e) => {
        if (recSuccess) {
            setRecSuccess(false);
        }
        const file_path = e.target.value.split('\\');
        const file_name = file_path[file_path.length - 1];
        setFileName(file_name);

        const newDialog = {
            name: file_name,
            objects: []
        }
        setRecDialog(prevState => [...prevState, newDialog]);

        const res = await fetchRecognize(e.target.files[0]);
        if (res.objects) {
            setRecDialog(prevState => prevState.map(item => {
                return item.name === file_name ? { ...item, objects: res.objects } : item
            }));
            setRecSuccess(true);
        }
    }, [fetchRecognize, recSuccess]);

    return {recDialog, fileName, selectFile, recSuccess};
};