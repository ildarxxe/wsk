import React from 'react';

const ChatInput = ({value, setValue, sendMessage, disabled}) => {
    return (
        <div className={'chat-input'}>
            <div className={'input-box'}>
                <input value={value} onChange={(e) => setValue(e.target.value)} type="text" id={'message'} name={'prompt'}/>
            </div>
            <div className={'btn-box'}>
                <button type={'submit'} onClick={(e) => {
                    e.preventDefault();
                    sendMessage(value);
                }} id={'send_btn'} disabled={disabled}>Send</button>
            </div>
        </div>
    );
};

export default ChatInput;