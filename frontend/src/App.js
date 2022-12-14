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
import VehiclePage from './pages/VehiclePage';
import RefuelingPage from './pages/RefuelingPage';
import ExpensePage from './pages/ExpensePage';
import StatisticsPage from './pages/StatisticsPage';

function App() {
    const authCtx = useContext(AuthContext);
    const isLoggedIn = authCtx.isLoggedIn;
    return (
        <Fragment>
            {isLoggedIn && <MainNavigation />}
            <main className='w3-container'>
                <Routes>
                    {isLoggedIn ? <Route path='/' element={<StartingPage />} /> : <Route path='/' element={<HomePage />} />}
                    <Route path='/signIn' element={<SignInPage />} />
                    <Route path='/signUp' element={<SignUpPage />} />
                    <Route path='/confirm' element={<ConfirmationPage />} />
                    <Route path='/confirm/:registrationKey' element={<ConfirmationPage />} />
                    {isLoggedIn && (<Fragment>
                        <Route path='/profile' element={<ProfilePage />} />
                        <Route path='/start' element={<StartingPage />} />
                        <Route path='/vehicle' element={<VehiclePage />} />
                        <Route path='/refueling' element={<RefuelingPage />} />
                        <Route path='/expense' element={<ExpensePage />} />
                        <Route path='/stats' element={<StatisticsPage />} />
                    </Fragment>)
                    }
                    <Route path='*' element={<Navigate replace to={'/'} />} />
                </Routes>
            </main>
        </Fragment>
    );
}

export default App;
