import React, {useEffect} from 'react';
import './auth.css'
import {UseAuthLogic} from "../../hooks/UseAuthLogic";

const Login = () => {
    const [visible, toggleVisible] = UseAuthLogic();
    useEffect(() => {
        const submit_btn = document.querySelector('.form__submit');
        submit_btn.onclick = (e) => {
            e.preventDefault();
            const form = submit_btn.closest('.form');
            fetch('http://127.0.0.1:8000/api/user/login', {
                method: 'POST',
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    name: form[0].value,
                    password: form[1].value
                }),
            })
                .then(res => res.json())
                .then(data => {
                    if (data.status) {
                        localStorage.setItem('token', data.token);
                        window.location.href = '/';
                    }
                })
                .catch(err => console.log(err));
        }
    }, [])
    return (
        <div className={'auth'}>
            <h1 className={'auth__title'}>Авторизация</h1>
            <form className={'form auth-form'}>
                <div className={'form__inner'}>
                    <div className={'form__block'}>
                        <label htmlFor="username">Username:</label>
                        <input type="text" id={'username'}/>
                    </div>
                    <div className={'form__block'}>
                        <label htmlFor="password">Password:</label>
                        <input type={visible ? 'text' : "password"} id={'password'}/>
                    </div>
                    <div className={'auth__buttons'}>
                        <button type={'button'} onClick={toggleVisible}
                                className={'password_visibility'}>{visible ? 'Hidden' : "Show"} password
                        </button>
                        <button type={'submit'} className={'form__submit'}>Send</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Login;