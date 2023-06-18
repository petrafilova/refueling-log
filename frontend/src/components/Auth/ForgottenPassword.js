import React, { useRef, useState, Fragment } from 'react';
import { requestReset } from '../../lib/api';
import { useNavigate } from 'react-router-dom';
import Loading from '../Layout/Loading';

const ForgottenPassword = () => {
    const navigate = useNavigate();
    const emailInputRef = useRef();

    const [emailIsValid, setEmailIsValid] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const submitHandler = async (event) => {
        event.preventDefault();
        const enteredEmail = emailInputRef.current.value;
        setEmailIsValid(true);
        let formIsInvalid = false;

        if (enteredEmail.trim().length < 6 || enteredEmail.trim().length > 320) {
            setEmailIsValid(false);
            formIsInvalid = true;
        }

        if (formIsInvalid) {
            return;
        }

        const regData = {
            email: enteredEmail,
        };

        setIsLoading(true);
        const success = await requestReset(regData);
        setIsLoading(false);
        success && navigate('/reset');
    };

    return (
        <Fragment>
            {isLoading && <Loading />}
            <div className='w3-container w3-content'>
                <h1>Zabudnté heslo</h1>
                <form onSubmit={submitHandler}>
                    <div className='w3-padding-16'>
                        <label className='w3-text-indigo' htmlFor='email'>
                            Email
                        </label>
                        <input
                            className="w3-input w3-border"
                            type='email'
                            id='email'
                            ref={emailInputRef}
                        ></input>
                        {!emailIsValid && <p className='w3-red'>Email musí obsahovať: min. 6 znakov, max. 320 znakov.</p>}
                    </div>
                    <div className='w3-padding-16'>
                        <button className='w3-button w3-indigo' type='submit'>
                            Reset hesla
                        </button>
                    </div>
                </form>
            </div>
        </Fragment>
    );
};

export default ForgottenPassword;
