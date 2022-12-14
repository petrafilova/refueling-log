import React, { useRef, useState } from 'react';

const ChangePasswordDialog = (props) => {
    const currentPasswordInputRef = useRef();
    const newPasswordInputRef = useRef();
    const compareNewPasswordInputRef = useRef();

    const [currentPasswordIsValid, setCurrentPasswordIsValid] = useState(true);
    const [newPasswordIsValid, setNewPasswordIsValid] = useState(true);
    const [matchedPasswordIsCorrect, setMatchedPasswordIsCorrect] = useState(true);

    const submitHandler = () => {
        const enteredCurrentPassword = currentPasswordInputRef.current.value;
        const enteredNewPassword = newPasswordInputRef.current.value;
        const compareNewPassword = compareNewPasswordInputRef.current.value;

        setCurrentPasswordIsValid(true);
        setNewPasswordIsValid(true);
        setMatchedPasswordIsCorrect(true);

        const containsDigits = /[0-9]/.test(enteredNewPassword);
        const containsUpper = /[A-Z]/.test(enteredNewPassword);
        const containsLower = /[a-z]/.test(enteredNewPassword);

        let formIsValid = true;

        if (enteredCurrentPassword.trim().length < 1) {
            setCurrentPasswordIsValid(false);
            formIsValid = false;
        }

        if (enteredNewPassword.trim().length < 8 || enteredNewPassword.trim().length > 250 || !containsDigits || !containsLower || !containsUpper) {
            setNewPasswordIsValid(false);
            formIsValid = false;
        }

        if (enteredNewPassword !== compareNewPassword) {
            setMatchedPasswordIsCorrect(false);
            formIsValid = false;
        }

        if (!formIsValid) {
            return;
        }

        props.onSubmit(enteredCurrentPassword, enteredNewPassword);
    };


    return (
        <div className='w3-modal w3-show'>
            <div className='w3-modal-content dialog'>
                <header className='w3-container w3-light-grey'>
                    <h2>Zmena hesla</h2>
                </header>
                <div className='w3-container'>
                    <p>
                        <label className='w3-text-indigo'htmlFor='currentPassword'>S????asn?? heslo: </label>
                        <input className='w3-input w3-border' type='password' id='currentPassword' ref={currentPasswordInputRef}></input>
                    </p>
                    {!currentPasswordIsValid && <p className='w3-red'>Zadajte s????asn?? heslo.</p>}
                    <p>
                        <label className='w3-text-indigo' htmlFor='newPassword'>Nov?? heslo: </label>
                        <input className='w3-input w3-border' type='password' id='newPassword' ref={newPasswordInputRef}></input>
                    </p>
                    {!newPasswordIsValid && <p className='w3-red'>Heslo mus?? obsahova??: min. 8 znakov, max. 250 znakov, min. 1 mal?? p??smeno, min. 1 ve??k?? p??smeno a min. 1 ????slo.</p>}
                    <p>
                        <label className='w3-text-indigo' htmlFor='compareNewPassword'>Nov?? heslo: </label>
                        <input className='w3-input w3-border' type='password' id='compareNewPassword' ref={compareNewPasswordInputRef}></input>
                    </p>
                    {!matchedPasswordIsCorrect && <p className='w3-red'>Zadan?? nov?? hesl?? sa nezhoduj??.</p>}
                </div>
                <footer className='w3-container w3-light-grey'>
                    <p>
                        <button className='w3-button w3-indigo' onClick={props.onCancel}>Zru??i??</button>
                        <button className='w3-button w3-indigo w3-right' onClick={submitHandler}>Potvrdi??</button>
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default ChangePasswordDialog;