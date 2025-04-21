import React from 'react';
import {Link} from "react-router-dom";

const Menu = () => {
    return (
        <nav className='menu hidden'>
            <Link className={'menu__link'} to="/">Create Conversation</Link>
            <Link className={'menu__link'} to="/generation-image">Generation Image</Link>
            <Link className={'menu__link'} to="/recognize">Recognize Image</Link>
        </nav>
    );
};

export default Menu;