import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../store/auth-context';

const MainNavigation = () => {
    const authCtx = useContext(AuthContext);

    const logout = () => {
        authCtx.logout();
    };

    return (
        <header>
            <nav className='w3-bar w3-indigo'>
                <Link className='w3-bar-item w3-button' to='/profile'>Profil</Link>
                <Link className='w3-bar-item w3-button' to='/vehicle'>Vozidlo</Link>
                <Link className='w3-bar-item w3-button' to='/refueling'>Tankovanie</Link>
                <Link className='w3-bar-item w3-button' to='/expense'>Výdavky</Link>
                <Link className='w3-bar-item w3-button' to='/stats'>Štatistiky</Link>
                <button className='w3-button w3-right' type='button' onClick={logout}>Odhlásiť sa</button>
            </nav>
        </header>
    );
};

export default MainNavigation;