import React from 'react';
import Chat from "../components/chat/Chat";

const Home = () => {
    return (
        <div className={'home height-100'}>
            <Chat welcome_text={'Hello, ask me a question'} api_url={'conversation'} />
        </div>
    );
};

export default Home;