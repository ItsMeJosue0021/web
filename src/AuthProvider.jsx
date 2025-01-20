import React, { createContext, useState, useEffect } from 'react';
import { _get, _post, _put, _delete } from "./api";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        if (localStorage.getItem('token')) {
            fetchUser();
        } else {
            setLoading(false);
        }

    }, []);


    const login = async (credentials, navigate) => {
        try {
            const res = await _post('/login', credentials);
            localStorage.setItem('token', res.data.access_token);
            await fetchUser();

            if (res.data.user.role.name === 'admin') {
                navigate('/roles');
            } else if (res.data.user.role.name === 'user') {
                navigate('/');
            }

        } catch (error) {   
            console.error(error);
        }
    };

    const fetchUser = async () => {
        try {
            const res = await _get('/user');
            setUser(res.data.user);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        await _post('/logout');
        setUser(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
