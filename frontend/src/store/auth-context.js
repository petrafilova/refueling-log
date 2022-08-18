import React, { useState } from 'react';

const AuthContext = React.createContext({
    token: '',
    refreshToken: '',
    username: '',
    isLoggedIn: false,
    login: () => { },
    logout: () => { },
});

const storedToken = localStorage.getItem('token');

export const AuthContextProvider = (props) => {
    const [token, setToken] = useState(storedToken);
    const [refreshToken, setRefreshToken] = useState(null);
    const [username, setUserName] = useState(null);

    const userIsLoggedIn = !!token;

    const loginHandler = (token, refreshToken, username) => {
        setToken(token);
        setRefreshToken(refreshToken);
        setUserName(username);
        localStorage.setItem('token', token);
    };

    const logoutHandler = () => {
        setToken(null);
        setRefreshToken(null);
        setUserName(null);
        localStorage.removeItem('token');
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