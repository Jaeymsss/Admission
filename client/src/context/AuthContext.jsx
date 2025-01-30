import React, { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userData, setUserData] = useState(null);
    const [token, setToken] = useState(null);
    const storedData = JSON.parse(localStorage.getItem('user_data'));

    useEffect(() => {
        if(storedData) {
            const { userToken, user } = storedData;
            setToken(userToken);
            setUserData(user);
            setIsAuthenticated(true);      
        }
        setLoading(false);
    },[]);

    const login = (token, data) => {
        localStorage.setItem('user_data', JSON.stringify({userToken: token, user: data}));
        setToken(token);
        setUserData(data);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('user_data');
        setToken(null);
        setUserData(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ loading, token, isAuthenticated, login, logout, userData }}>
            {loading ? <div>Loading...</div> : children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
}