import React from 'react';
import './Chat.css';
import ChatInput from "./ChatInput";
import SelectFile from "./SelectFile";
import Spinner from "../spinner/Spinner";
import {UseChatLogic} from "../../../hooks/UseChatLogic";

const Chat = ({welcome_text, request = 'message', api_url}) => {
    const {success, dialog, newMessage, sendMessage, setNewMessage, firstMessage} = UseChatLogic(api_url);
    return (
        <div className={'chat'}>
            {firstMessage ? <div className={'welcome'}>
                <h1>{welcome_text}</h1>
            </div> : <h1 className={'chat__title'}>Ваш диалог</h1>}

            <div className={'chat__inner'}>
                <div className={'chat__boxes'}>
                    {dialog.map((item, index) => (
                        <div className={'chat__box'} key={item.job_id}>
                            <div className={'question'}><p>{item.message}</p></div>
                            <div className={'answer'}>{!success && index === dialog.length - 1 ?
                                <Spinner/> : null} <p>{item.answer}</p></div>
                        </div>
                    ))}
                </div>
            </div>
            {request === "message" ? <ChatInput disabled={(!success && !firstMessage)} value={newMessage} setValue={setNewMessage} sendMessage={sendMessage}/> : <SelectFile/>}
        </div>
    );
};

export default Chat;