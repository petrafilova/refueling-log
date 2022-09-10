import React, { useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import { refreshToken as refreshTokenFunction } from '../lib/api';

const AuthContext = React.createContext({
    token: '',
    refreshToken: '',
    username: '',
    isLoggedIn: false,
    login: () => { },
    logout: () => { },
});

const tokenValidity = (token) => {
    if (token === null) {
        return -1;
    }
    const decoded = jwt_decode(token);
    const tokenValidity = decoded.exp * 1000 - Date.now();
    return tokenValidity - 60000;
};

const storedToken = localStorage.getItem('token');
const storedRefreshToken = localStorage.getItem('refreshToken');

export const AuthContextProvider = (props) => {
    const [token, setToken] = useState(tokenValidity(storedToken) > 0 ? storedToken : null);
    const [refreshToken, setRefreshToken] = useState(tokenValidity(storedRefreshToken) > 0 ? storedRefreshToken : null);
    const [username, setUserName] = useState(null);

    const userIsLoggedIn = !!token;

    useEffect(() => {
        const tokenIsValid = tokenValidity(token) > 0;
        const refreshTokenIsValid = tokenValidity(refreshToken) > 0;
        if (tokenIsValid && refreshTokenIsValid) {
            const interval = setTimeout(() => {
                (async () => {
                    const sendRefreshToken = { refreshToken: refreshToken };
                    const data = await refreshTokenFunction(sendRefreshToken);
                    if (data) {
                        loginHandler(data.token, data.refreshToken, data.username);
                    }
                    if (!data) {
                        logoutHandler();
                    }
                })();
            }, tokenValidity(token));
            return () => {
                clearInterval(interval);
            };
        } else if (refreshTokenIsValid) {
            (async () => {
                const sendRefreshToken = { refreshToken: refreshToken };
                const data = await refreshTokenFunction(sendRefreshToken);
                if (data) {
                    loginHandler(data.token, data.refreshToken, data.username);
                }
                if (!data) {
                    logoutHandler();
                }
            })();
        } else {
            logoutHandler();
        }
    }, [token, refreshToken, username]);

    const loginHandler = (token, refreshToken, username) => {
        setToken(token);
        setRefreshToken(refreshToken);
        setUserName(username);
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
    };

    const logoutHandler = () => {
        setToken(null);
        setRefreshToken(null);
        setUserName(null);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
    };

    const contextValue = {
        token: token,
        refreshToken: refreshToken,
        username: username,
        isLoggedIn: userIsLoggedIn,
        login: loginHandler,
        logout: logoutHandler,
    };

    return (<AuthContext.Provider value={contextValue}>
        {props.children}
    </AuthContext.Provider>);
};

export default AuthContext;