import React from 'react';
import {Link} from 'react-router-dom';
import './Common.css'


const Header = () => {
    const isLogged= localStorage.getItem("token") !== null;

    function logout() {
        localStorage.removeItem("token");
        window.location.reload();
    }

    React.useEffect(() => {
        const logo = document.querySelector(".header__logo");
        logo.onclick = () => {
            document.querySelector('.menu').classList.toggle('hidden');
        }
    }, [])
    return (
        <header className={'header'}>
            <div className={'header__logo'}>
                ChatGPP
            </div>
            <nav className={'header__nav'}>
                {isLogged ? <><Link to="#" onClick={logout}>Logout</Link></> : <><Link to="/signin">Sign in</Link>
                    <Link to="/signup">Sign up</Link></>}
            </nav>
        </header>
    );
};

export default Header;