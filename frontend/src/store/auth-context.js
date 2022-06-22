import React, { useState } from 'react';

const AuthContext = React.createContext({
    token: '',
    refreshToken: '',
    isLoggedIn: false,
    login: () => { },
    logout: () => { },
});

export const AuthContextProvider = (props) => {
    const [token, setToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);

    const userIsLoggedIn = !!token;

    const loginHandler = (token) => {
        setToken(token);
        setRefreshToken(refreshToken);
        console.log('ok');
    };

    const logoutHandler = () => {
        setToken(null);
        setRefreshToken(null);
    };

    const contextValue = {
        token: token,
        refreshToken: refreshToken,
        isLoggedIn: userIsLoggedIn,
        login: loginHandler,
        logout: logoutHandler,

    };

    return (<AuthContext.Provider value={contextValue}>
        {props.children}
    </AuthContext.Provider>);

};

export default AuthContext;