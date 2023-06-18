import React, { useRef, useState, Fragment } from 'react';
import { reset } from '../../lib/api';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../Layout/Loading';

const ResetPassword = () => {
    const params = useParams();
    const navigate = useNavigate();
    const userNameInputRef = useRef();
    const passwordInputRef = useRef();
    const keyInputRef = useRef();

    const [userNameIsValid, setUserNameIsValid] = useState(true);
    const [passwordIsValid, setPasswordIsValid] = useState(true);
    const [keyIsValid, setKeyIsValid] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    let resetKey = '';

    if (params.resetKey) {
        resetKey = params.resetKey;
    }

    const submitKeyHandler = async (event) => {
        event.preventDefault();
        setKeyIsValid(true);

        const enteredUserName = userNameInputRef.current.value;
        const enteredPassword = passwordInputRef.current.value;
        const enteredResetKey = keyInputRef.current.value;

        setUserNameIsValid(true);
        setPasswordIsValid(true);
        setKeyIsValid(true);

        const containsDigits = /[0-9]/.test(enteredPassword);
        const containsUpper = /[A-Z]/.test(enteredPassword);
        const containsLower = /[a-z]/.test(enteredPassword);

        let formIsInvalid = false;

        if (!enteredResetKey.trim().length === 36) {
            setKeyIsValid(false);
            return;
        }

        if (enteredUserName.trim().length < 4 || enteredUserName.trim().length > 50) {
            setUserNameIsValid(false);
            formIsInvalid = true;
        }

        if (enteredPassword.trim().length < 8 || enteredPassword.trim().length > 250 || !containsDigits || !containsLower || !containsUpper) {
            setPasswordIsValid(false);
            formIsInvalid = true;
        }

        if (formIsInvalid) {
            return;
        }

        const regData = {
            username: enteredUserName,
            newPassword: enteredPassword,
            uuid: enteredResetKey,
        };


        setIsLoading(true);
        const sucess = await reset(regData);
        setIsLoading(false);
        
        sucess && navigate('/signIn');
    };

    return (
        <Fragment>
            {isLoading && <Loading />}
            <div className='w3-container w3-content'>
                <h1>Reset hesla</h1>
                <form onSubmit={submitKeyHandler}>
                    <div className='w3-padding-16'>
                        <label className='w3-text-indigo' htmlFor='text'>
                            Pre dokončenie resetu hesla prosím zadajte kľúč.
                        </label>
                        <input
                            className='w3-input w3-border'
                            type='text'
                            id='text'
                            ref={keyInputRef}
                            defaultValue={resetKey}
                        ></input>
                    </div>
                    <div className='w3-padding-16'>
                        <label className='w3-text-indigo' htmlFor='text'>
                            Používateľské meno
                        </label>
                        <input
                            className='w3-input w3-border'
                            type='text'
                            id='text'
                            ref={userNameInputRef}
                        ></input>
                        {!userNameIsValid && (
                            <p className='w3-red'>
                                Používateľského meno musí obsahovať: min. 4
                                znaky, max. 50 znakov.
                            </p>
                        )}
                    </div>
                    <div className='w3-padding-16'>
                        <label className='w3-text-indigo' htmlFor='password'>
                            Prihlasovacie heslo
                        </label>
                        <input
                            className='w3-input w3-border'
                            type='password'
                            id='password'
                            ref={passwordInputRef}
                        ></input>
                        {!passwordIsValid && (
                            <p className='w3-red'>
                                Heslo musí obsahovať: min. 8 znakov, max. 250
                                znakov, min. 1 malé písmeno, min. 1 veľké
                                písmeno a min. 1 číslo.
                            </p>
                        )}
                    </div>
                    <div className='w3-padding-16'>
                        <button className='w3-button w3-indigo' type='submit'>
                            Potvrdiť
                        </button>
                        {!keyIsValid && (
                            <p className='w3-red'>Neplatný registračný kľúč.</p>
                        )}
                    </div>
                </form>
            </div>
        </Fragment>
    );
};
export default ResetPassword;
