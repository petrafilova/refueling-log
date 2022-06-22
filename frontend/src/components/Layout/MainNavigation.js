import React from 'react';
import { Link } from 'react-router-dom';

const MainNavigation = () => {
    return (
        <header>
            <nav className="w3-bar w3-indigo">
                <Link className="w3-bar-item w3-button" to='/profile'>something1</Link>
                <Link className="w3-bar-item w3-button" to='/profile'>something2</Link>
                <Link className="w3-bar-item w3-button" to='/profile'>Profile</Link>
                <Link className="w3-bar-item w3-button" to='/profile'>something3</Link>
                <button className='w3-button w3-right' type='button'>Logout</button>
            </nav>
        </header>
    );
};

export default MainNavigation;