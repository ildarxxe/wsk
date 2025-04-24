import React from 'react';

export const UseChatLogic = (api_url) => {
    const [success, setSuccess] = React.useState(false);
    const [processGetAnswer, setProcessGetAnswer] = React.useState(null);
    const isLogged = localStorage.getItem("token") !== null;
    const [dialog, setDialog] = React.useState([]);
    const [currentJobId, setCurrentJobId] = React.useState(null);
    const [newMessage, setNewMessage] = React.useState('');
    const [firstMessage, setFirstMessage] = React.useState(true);
    const isImageGeneration = api_url === "generation-image";

    const createChat = React.useCallback(async (message) => {
        const urlSegment = isImageGeneration ? "/generate" : "";
        const res = await fetch(`http://127.0.0.1:8000/api/${api_url}${urlSegment}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ` + localStorage.getItem("token"),
            },
            body: JSON.stringify({
                message: message,
            })
        });
        return res.json();
    }, [api_url, isImageGeneration]);

    const getAnswer = React.useCallback(async (id) => {
        const urlSegment = isImageGeneration ? '/status' : '';
        const res = await fetch(`http://127.0.0.1:8000/api/${api_url}${urlSegment}/${id}`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token"),
            }
        });
        return res.json();
    }, [api_url, isImageGeneration]);

    const updateDialog = React.useCallback((id, updateAnswer) => {
        setDialog(prevDialog => prevDialog.map(item => {
            if (item.job_id === id) {
                return { ...item, answer: updateAnswer, query_count: item.query_count + 1 };
            }
            return item;
        }));
    }, [setDialog]);

    const startPollingForAnswer = React.useCallback((jobId) => {
        const intervalId = setInterval(async () => {
            const answerRes = await getAnswer(jobId);
            const answerText = isImageGeneration ? (answerRes?.image_url ?? '') : (answerRes?.answer ?? '');
            updateDialog(jobId, answerText);
            if (answerRes?.status === false || (isImageGeneration && answerRes?.progress === 100)) {
                if (isImageGeneration) {
                    await getAnswer(jobId);
                }
                setSuccess(true);
                clearInterval(intervalId);
                setProcessGetAnswer(null);
            }
        }, 1000);
        setProcessGetAnswer(intervalId);
    }, [getAnswer, updateDialog, setSuccess, setProcessGetAnswer, isImageGeneration]);

    const sendMessage = React.useCallback(async () => {
        if (isLogged && newMessage) {
            setSuccess(false);
            if (processGetAnswer) {
                clearInterval(processGetAnswer);
                setProcessGetAnswer(null);
            }

            const res = await createChat(newMessage);
            const newJobId = res.current_job_id;
            setCurrentJobId(newJobId);
            setNewMessage('');

            setDialog(prevDialog => [...prevDialog, {
                job_id: newJobId,
                message: newMessage,
                answer: '',
                query_count: 1,
            }]);
            setFirstMessage(false);

            if (newJobId) {
                startPollingForAnswer(newJobId);
            }
        } else if (!isLogged) {
            window.location.href = '/signin';
        }
    }, [isLogged, newMessage, createChat, startPollingForAnswer, processGetAnswer, setSuccess, setProcessGetAnswer, setCurrentJobId, setDialog, isImageGeneration]);

    React.useEffect(() => {
        return () => {
            if (processGetAnswer) {
                clearInterval(processGetAnswer);
            }
        };
    }, [processGetAnswer]);

    return {
        success,
        dialog,
        sendMessage,
        setNewMessage,
        newMessage,
        firstMessage
    };
};