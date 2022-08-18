import React, { useRef, useState } from 'react';
import { register } from '../../lib/api'; 
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const navigate = useNavigate();
    const userNameInputRef = useRef();
    const passwordInputRef = useRef();
    const emailInputRef = useRef();
    
    const [userNameIsValid, setUserNameIsValid] = useState(true);
    const [passwordIsValid, setPasswordIsValid] = useState(true);
    const [emailIsValid, setEmailIsValid] = useState(true);

    const submitHandler = async (event) => {
        event.preventDefault();
        const enteredUserName = userNameInputRef.current.value;
        const enteredPassword = passwordInputRef.current.value;
        const enteredEmail = emailInputRef.current.value;

        setUserNameIsValid(true);
        setPasswordIsValid(true);
        setEmailIsValid(true);

        const containsDigits = /[0-9]/.test(enteredPassword);
        const containsUpper = /[A-Z]/.test(enteredPassword);
        const containsLower = /[a-z]/.test(enteredPassword);

        let formIsInvalid = false;

        if (enteredUserName.trim().length < 4 || enteredUserName.trim().length > 50) {
            setUserNameIsValid(false);
            formIsInvalid = true;
        }

        if (enteredPassword.trim().length < 8 || enteredPassword.trim().length > 250 || !containsDigits || !containsLower || !containsUpper) {
            setPasswordIsValid(false);
            formIsInvalid = true;
        }

        if (enteredEmail.trim().length < 6 || enteredEmail.trim().length > 320) {
            setEmailIsValid(false);
            formIsInvalid = true;
        }

        if (formIsInvalid) {
            return;
        }

        const regData = {
            username: enteredUserName,
            password: enteredPassword,
            email: enteredEmail,
        };

        const success = await register(regData);
        success && navigate('/confirm');
    };

    return (
        <div className="w3-container w3-content">
            <h1>Registrácia</h1>
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
                        // minLength={4}
                        // maxLength={50}
                        ref={userNameInputRef}
                    ></input>
                    {!userNameIsValid && <p className='w3-red'>Používateľského meno musí obsahovať: min. 4 znaky, max. 50 znakov.</p>}
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
                        // minLength={8}
                        // maxLength={250}
                        ref={passwordInputRef}
                    ></input>
                    {!passwordIsValid && <p className='w3-red'>Heslo musí obsahovať: min. 8 znakov, max. 250 znakov, min. 1 malé písmeno, min. 1 veľké písmeno a min. 1 číslo.</p>}
                </div>
                <div className="w3-padding-16">
                    <label className="w3-text-indigo" htmlFor="email">
                        email
                    </label>
                    <input
                        className="w3-input w3-border"
                        type="email"
                        id="email"
                        // required
                        // minLength={6}
                        // maxLength={320}
                        ref={emailInputRef}
                    ></input>
                    {!emailIsValid && <p className='w3-red'>Používateľského meno musí obsahovať: min. 6 znakov, max. 320 znakov.</p>}
                </div>
                <div className="w3-padding-16">
                    <button className="w3-button w3-indigo" type="submit">
                        Zaregistrovať sa
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SignUp;
