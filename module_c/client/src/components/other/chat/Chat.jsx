import React from 'react';
import './Chat.css';
import ChatInput from "./ChatInput";
import SelectFile from "./SelectFile";
import Spinner from "../spinner/Spinner";
import {UseChatLogic} from "../../../hooks/UseChatLogic";
import {UseRecognize} from "../../../hooks/UseRecognize";

const Chat = ({welcome_text, request = 'message', api_url}) => {
    const isRecognized = request === "file";
    const {success, dialog, newMessage, sendMessage, setNewMessage, firstMessage} = UseChatLogic(api_url);
    const {recDialog, recSuccess, selectFile} = UseRecognize();
    const emptyDialog = request === 'file' ? recDialog.length === 0 : firstMessage;
    return (
        <div className={'chat'}>
            {emptyDialog ? <div className={'welcome'}>
                <h1>{welcome_text}</h1>
            </div> : <h1 className={'chat__title'}>Ваш диалог</h1>}

            <div className={`chat__inner ${emptyDialog ? 'empty__dialog' : ''}`}>
                <div className={'chat__boxes'}>
                    {!isRecognized ? <>
                        {dialog.map((item, index) => (
                            <div className={'chat__box'} key={item.job_id}>
                                <div className={'question'}><p>{item.message}</p></div>
                                <div className={'answer'}>{!success && index === dialog.length - 1 ?
                                    <Spinner/> : null} {api_url === "conversation" ? <p>{item.answer}</p> :
                                    <img className={'generate_image'} id={`image` + item.query_count}
                                         src={'http://127.0.0.1:8000' + item.answer} alt="generate image"/>}</div>
                            </div>
                        ))}
                    </> : <>
                        {recDialog.length > 0 ? recDialog.map((item) =>
                            <div className={'chat__box'} key={item.name}>
                                <div className={'question'}><p>Ваше изображение: {item.name ?? 'null name'}</p></div>
                                <div
                                    className={'answer'}>{!recSuccess && item.name === recDialog[recDialog.length - 1].name ?
                                    <Spinner/> : null} {item.objects ? <div>Найденные объекты: {item.objects.map(obj =>
                                    <table>
                                        <thead>
                                        <tr>
                                            <th>Номер</th>
                                            <th>Объект</th>
                                            <th>Вероятность</th>
                                            <th>X</th>
                                            <th>Y</th>
                                            <th>Ширина</th>
                                            <th>Высота</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr>
                                            <td>{obj.id}</td>
                                            <td>{obj.name}</td>
                                            <td>{String(obj.probability).substring(0,4)}</td>
                                            <td>{obj.bounding_box.x}</td>
                                            <td>{obj.bounding_box.y}</td>
                                            <td>{obj.bounding_box.width}</td>
                                            <td>{obj.bounding_box.height}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                )}</div> : 'Объектов не найдено'}</div>
                            </div>
                        ) : null} </>}
                </div>
            </div>
            {request === "message" ?
                <ChatInput disabled={(!success && !firstMessage)} value={newMessage} setValue={setNewMessage}
                           sendMessage={sendMessage}/> : <SelectFile selectFile={selectFile}/>}
        </div>
    );
};

export default Chat;