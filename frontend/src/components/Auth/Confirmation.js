import React, { useRef, useState, useContext, Fragment } from 'react';
import { confirm } from '../../lib/api';
import AuthContext from '../../store/auth-context';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../Layout/Loading';

const Confirmation = () => {
    const params = useParams();
    const authCtx = useContext(AuthContext);
    const navigate = useNavigate();
    const keyInputRef = useRef();
    const [keyIsValid, setKeyIsValid] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    let registrationKey = '';

    if (params.registrationKey) {
        registrationKey = params.registrationKey;
    }

    const submitKeyHandler = async (event) => {
        event.preventDefault();
        setKeyIsValid(true);

        registrationKey = keyInputRef.current.value;

        if (!registrationKey.trim().length === 36) {
            setKeyIsValid(false);
            return;
        }

        setIsLoading(true);
        const authData = await confirm(registrationKey);
        setIsLoading(false);
        authCtx.login(authData.token, authData.refreshToken, authData.username);
        authData.token && navigate('/');
    };

    return (
        <Fragment>
            {isLoading && <Loading />}
            <div className='w3-container w3-content'>
                <h1>Potvrdenie registrácie</h1>
                <form onSubmit={submitKeyHandler}>
                    <div className='w3-padding-16'>
                        <label className='w3-text-indigo' htmlFor='text'>Pre dokončenie registrácie prosím zadajte registračný kľúč.</label>
                        <input className='w3-input w3-border'
                            type='text'
                            id='text'
                            ref={keyInputRef}
                            defaultValue={registrationKey}
                        >
                        </input>
                    </div>
                    <div className='w3-padding-16'>
                        <button className='w3-button w3-indigo' type='submit'>Potvrdiť</button>
                        {!keyIsValid && <p className='w3-red'>Neplatný registračný kľúč.</p>}
                    </div>
                </form>
            </div>
        </Fragment>
    );
};

export default Confirmation;
