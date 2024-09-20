import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        isAuthenticated: false,
        userId: null,
        userName: null,
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Fetch user info or validate token here (handle errors)
            setAuth({
                isAuthenticated: true,
                userId: localStorage.getItem('userId'),
                userName: localStorage.getItem('userName'),
            });
        }
    }, []);

    const login = (userId, userName, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        localStorage.setItem('userName', userName);
        setAuth({
            isAuthenticated: true,
            userId,
            userName,
        });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        setAuth({
            isAuthenticated: false,
            userId: null,
            userName: null,
        });
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
