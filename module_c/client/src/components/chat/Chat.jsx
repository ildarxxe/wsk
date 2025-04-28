import React from 'react';
import './Chat.css';
import ChatInput from "./ChatInput";
import SelectFile from "./SelectFile";
import Spinner from "../common/spinner/Spinner";
import {UseChatLogic} from "../../hooks/UseChatLogic";
import {UseRecognize} from "../../hooks/UseRecognize";
import {Stage, Layer, Image, Circle} from 'react-konva';

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
                                         src={'http://127.0.0.1:8000' + item.answer} alt="image"/>}</div>
                            </div>
                        ))}
                    </> : <>
                        {recDialog.length > 0 ? recDialog.map((item) =>
                            <div className={'chat__box'} key={item.name}>
                                <div className={'question'}><p>Ваше изображение: {item.name ?? 'null name'}</p></div>
                                <div
                                    className={'answer'}>{!recSuccess && item.name === recDialog[recDialog.length - 1].name ?
                                    <Spinner/> : null} {item.objects ? <div>Найденные объекты:
                                    <Stage width={item.size.width} height={item.size.height}>
                                        <Layer>
                                            <Image image={item.image} width={item.size.width} height={item.size.height} />
                                            {item.objects.map((obj, index) => (
                                                <Circle
                                                    key={index}
                                                    x={obj.bounding_box.x}
                                                    y={obj.bounding_box.y}
                                                    radius={5}
                                                    fill="red"
                                                    stroke="black"
                                                    strokeWidth={1}
                                                />
                                            ))}
                                        </Layer>
                                    </Stage>
                                    </div> : 'Объектов не найдено'}</div>
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