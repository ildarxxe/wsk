import React from 'react';
import Chat from "../components/other/chat/Chat";

const GenerationImage = () => {
    return (
        <div className={'generation-image height-100'}>
            <Chat welcome_text={'Hello, generate your image'} api_url={'generation-image'}/>
        </div>
    );
};

export default GenerationImage;