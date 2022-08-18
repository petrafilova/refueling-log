import React, { useRef, useState, useContext } from 'react';
import { confirm } from '../../lib/api';
import AuthContext from '../../store/auth-context';
import { useNavigate } from 'react-router-dom';

const Confirmation = () => {
    const authCtx = useContext(AuthContext);
    const navigate = useNavigate();
    const keyInputRef = useRef();
    const [keyIsValid, setKeyIsValid] = useState(true);
    
    const submitKeyHandler = async (event) => {
        event.preventDefault();
        setKeyIsValid(true);
        const registrationKey = keyInputRef.current.value;
        
        if (!registrationKey.trim().length === 36) {
            setKeyIsValid(false);
            return;
        }

        const authData = await confirm(registrationKey);
        authCtx.login(authData.token, authData.refreshToken, authData.username);
        authData.token && navigate('/start');
    };

    return (
        <div className="w3-container w3-content">
            <h1>Potvrdenie registrácie</h1>
            <form onSubmit={submitKeyHandler}>
                <div className="w3-padding-16">
                    <label className="w3-text-indigo" htmlFor="text">Pre dokončenie registrácie prosím zadajte registračný kľúč.</label>
                    <input className="w3-input w3-border"
                        type="text"
                        id="text"
                        ref={keyInputRef}></input>
                </div>
                <div className="w3-padding-16">
                    <button className="w3-button w3-indigo" type="submit">Potvrdiť</button>
                    {!keyIsValid && <p className='w3-red'>Neplatný registračný kľúč.</p>}
                </div>
            </form>
        </div>
    );
};

export default Confirmation;
