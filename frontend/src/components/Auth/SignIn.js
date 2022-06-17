import React, { useRef, useState } from 'react';
import { login } from '../../lib/api';

const SignIp = () => {
    const userNameInputRef = useRef();
    const passwordInputRef = useRef();
    
    const [userNameIsValid, setUserNameIsValid] = useState(true);
    const [passwordIsValid, setPasswordIsValid] = useState(true);
    
    const submitHandler = (event) => {
        event.preventDefault();
        const enteredUserName = userNameInputRef.current.value;
        const enteredPassword = passwordInputRef.current.value;

        console.log(enteredUserName, enteredPassword);

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

        login(loginData);
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
                        // required
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
                        // required
                        ref={passwordInputRef}
                    ></input>
                    {!passwordIsValid && <p className='w3-red'>Neplatné heslo.</p>}
                </div>
                <div className="w3-padding-16">
                    <button className="w3-btn w3-indigo" type="submit">
                        Prihlásiť sa
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SignIp;
