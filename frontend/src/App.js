import React from 'react';
import './App.css';

import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import ConfirmationPage from './pages/ConfirmationPage';

function App() {
    return (
        <Routes>
            <Route path='/' element={<HomePage />}/>
            <Route path='/signIn' element={<SignInPage />}/>
            <Route path='/signUp' element={<SignUpPage />}/>
            <Route path='/confirm' element={<ConfirmationPage />}/>
        </Routes>
    );
}

export default App;
