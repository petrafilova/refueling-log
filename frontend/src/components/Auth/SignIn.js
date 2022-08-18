import React, { useRef, useState, useContext, useEffect } from 'react';
import { login } from '../../lib/api';
import AuthContext from '../../store/auth-context';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
    const authCtx = useContext(AuthContext);
    const navigate = useNavigate();
    const userNameInputRef = useRef();
    const passwordInputRef = useRef();
    const [userNameIsValid, setUserNameIsValid] = useState(true);
    const [passwordIsValid, setPasswordIsValid] = useState(true);

    useEffect(() =>{
        authCtx.isLoggedIn && navigate('/start');
    }, [authCtx.isLoggedIn, navigate]);

    const submitHandler = async (event) => {
        event.preventDefault();
        const enteredUserName = userNameInputRef.current.value;
        const enteredPassword = passwordInputRef.current.value;

        setUserNameIsValid(true);
        setPasswordIsValid(true);

        if (enteredUserName.trim().length < 1 || enteredUserName.trim().length > 50) {
            setUserNameIsValid(false);
            return;
        }

        if (enteredPassword.trim().length < 1 || enteredPassword.trim().length > 250) {
            setPasswordIsValid(false);
            return;
        }

        const loginData = {
            username: enteredUserName,
            password: enteredPassword,
        };

        const confirmedData = await login(loginData);
        authCtx.login(confirmedData.token, confirmedData.refreshToken, confirmedData.username);
    };

    return (
        <div className="w3-container w3-content">
            <h1>Prihlásenie</h1>
            <form onSubmit={submitHandler}>
                <div className="w3-padding-16">
                    <label className="w3-text-indigo" htmlFor="text">
                        používateľské meno
                    </label>
                    <input
                        className="w3-input w3-border"
                        type="text"
                        id="text"
                        ref={userNameInputRef}
                    ></input>
                    {!userNameIsValid && <p className='w3-red'>Neplatné používateľského meno.</p>}
                </div>
                <div className="w3-padding-16">
                    <label className="w3-text-indigo" htmlFor="password">
                        prihlasovacie heslo
                    </label>
                    <input
                        className="w3-input w3-border"
                        type="password"
                        id="password"
                        ref={passwordInputRef}
                    ></input>
                    {!passwordIsValid && <p className='w3-red'>Neplatné heslo.</p>}
                </div>
                <div className="w3-padding-16">
                    <button className="w3-button w3-indigo" type="submit">
                        Prihlásiť sa
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SignIn;
