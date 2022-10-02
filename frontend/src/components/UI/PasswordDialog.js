import React, { useRef } from 'react';

const PasswordDialog = (props) => {
    const passwordInputRef = useRef();

    const submitHandler = () => {
        const password = passwordInputRef.current.value;
        props.onSubmit(password);
    };

    return (
        <div className='w3-modal w3-show'>
            <div className='w3-modal-content dialog'>
                <header className='w3-container w3-light-grey'>
                    <h2>Zmazanie účtu</h2>
                </header>
                <div className='w3-container'>
                    <p>
                        <label className='w3-text-indigo' htmlFor='currentPassword'>Heslo: </label>
                        <input className='w3-input w3-border' type='password' id='password' ref={passwordInputRef}></input>
                    </p>
                </div>
                <footer className='w3-container w3-light-grey'>
                    <p>
                        <button className='w3-button w3-indigo' onClick={props.onCancel}>Zrušiť</button>
                        <button className='w3-button w3-indigo w3-right' onClick={submitHandler}>Potvrdiť</button>
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default PasswordDialog;