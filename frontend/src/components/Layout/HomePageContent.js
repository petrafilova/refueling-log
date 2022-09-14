import React from 'react';
import { Link } from 'react-router-dom';

const HomePageContent = () => {
    return (
        <div className='w3-container'>
            <h1>Vitajte na stránke spotreby paliva.</h1>
            <div className='w3-panel w3-indigo w3-padding-16'>
                <Link to='/signIn'>Prihlásenie</Link>
            </div>
            <div className='w3-panel w3-indigo w3-padding-16'>
                <Link to='/signUp'>Registrácia</Link>
            </div>
            <div className='w3-panel w3-yellow'>
                <h2>Oznam</h2>
                <p>
                    Aplikácia pre svoju funkčnosť vyžaduje uložiť v localStorage
                    vašeho prehliadača informáciu o aktuálne prihlásenom
                    používateľovi. Registráciou súhlasíte s ukladaním tejto
                    informácie. Pri odhlásení dôjde k vymazaniu záznamu v
                    localStorage.
                </p>
            </div>
            <div className='w3-panel w3-yellow'>
                <h2>Zdrojový kód</h2>
                <p>
                    Zdrojový kód aplikácie je dostupný na{' '}
                    <a
                        href='https://github.com/petrafilova/refueling-log'
                        target='_blank'
                        rel='noreferrer'
                    >
                        github.com
                    </a>
                </p>
            </div>
        </div>
    );
};

export default HomePageContent;
