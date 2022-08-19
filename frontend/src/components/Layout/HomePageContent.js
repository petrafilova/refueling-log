import React from 'react';
import { Link } from 'react-router-dom';

const HomePageContent = () => {
    return (
        <div className='w3-container'>
            <h1>Vitajte na stránke spotreby paliva.</h1>
            <div className='w3-panel w3-indigo w3-padding-16'>
                <Link to='/signIn'>
                    Prihlásenie
                </Link>
            </div>
            <div className='w3-panel w3-indigo w3-padding-16' >
                <Link to='/signUp'>
                    Registrácia
                </Link>
            </div>
        </div>
    );
};

export default HomePageContent;
