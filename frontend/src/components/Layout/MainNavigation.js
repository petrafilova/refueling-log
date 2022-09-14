import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../store/auth-context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCar, faGasPump, faEuroSign, faChartSimple, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

const MainNavigation = () => {
    const authCtx = useContext(AuthContext);

    const logout = () => {
        authCtx.logout();
    };

    return (
        <header>
            <nav className='w3-bar w3-indigo'>
                <Link className='w3-bar-item w3-button' to='/profile' aria-label='Profil'><FontAwesomeIcon icon={faUser} /><span className='smHide'> Profil</span></Link>
                <Link className='w3-bar-item w3-button' to='/vehicle' aria-label='Vozidlo'><FontAwesomeIcon icon={faCar} /><span className='smHide'> Vozidlo</span></Link>
                <Link className='w3-bar-item w3-button' to='/refueling' aria-label='Tankovanie'><FontAwesomeIcon icon={faGasPump} /><span className='smHide'> Tankovanie</span></Link>
                <Link className='w3-bar-item w3-button' to='/expense' aria-label='Výdavky'><FontAwesomeIcon icon={faEuroSign} /><span className='smHide'> Výdavky</span></Link>
                <Link className='w3-bar-item w3-button' to='/stats' aria-label='Štatistiky'><FontAwesomeIcon icon={faChartSimple} /><span className='smHide'> Štatistiky</span></Link>
                <button className='w3-button w3-right' type='button' onClick={logout} aria-label='Odhlásiť sa'><FontAwesomeIcon icon={faRightFromBracket} /><span className='smHide'> Odhlásiť sa</span></button>
            </nav>
        </header>
    );
};

export default MainNavigation;