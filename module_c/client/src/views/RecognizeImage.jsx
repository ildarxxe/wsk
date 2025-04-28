import React from 'react';
import Chat from "../components/chat/Chat";

const RecognizeImage = () => {
    return (
        <div className={'recognize height-100'}>
            <Chat welcome_text={'Hello, recognize your image'} request={'file'}/>
        </div>
    );
};

export default RecognizeImage;