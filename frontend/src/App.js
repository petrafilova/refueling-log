import React, { Fragment, useContext } from 'react';
import './App.css';

import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import ConfirmationPage from './pages/ConfirmationPage';
import ProfilePage from './pages/ProfilePage';
import StartingPage from './pages/StartingPage';
import AuthContext from './store/auth-context';
import MainNavigation from './components/Layout/MainNavigation';

function App() {
    const authCtx = useContext(AuthContext);
    const visibleMainNav = authCtx.isLoggedIn;
    return (
        <Fragment>
            {visibleMainNav && <MainNavigation />}
            <Routes>
                <Route path='/' element={<HomePage />} />
                <Route path='/signIn' element={<SignInPage />} />
                <Route path='/signUp' element={<SignUpPage />} />
                <Route path='/confirm' element={<ConfirmationPage />} />
                <Route path='/profile' element={<ProfilePage />} />
                <Route path='/start' element={<StartingPage />} />
                <Route path='*' element={<Navigate replace to={'/'} />} />
            </Routes>
        </Fragment>

    );
}

export default App;
