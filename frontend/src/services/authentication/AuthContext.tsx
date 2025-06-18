import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext<{
    isLoggedIn: boolean;
    setIsLoggedIn: (value: boolean) => void;
    refreshToken: () => Promise<void>;
} | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(() =>
        localStorage.getItem('is_logged_in') === 'true'
    );

    useEffect(() => {
        localStorage.setItem('is_logged_in', isLoggedIn.toString());
    }, [isLoggedIn]);

    const refreshToken = async () => {
        const refresh = localStorage.getItem('refresh');
        if (!refresh) {
            setIsLoggedIn(false);
            return;
        }

        try {
            /* POST method */
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/users/refresh/`, {
                refresh: refresh
            }, {
                headers: { 'Authorization': `Bearer ${refresh}` }
            });

            const tokens = response.data;

            localStorage.setItem('access_token', tokens.access);
            localStorage.setItem('refresh_token', tokens.refresh);

            setIsLoggedIn(true);
        } catch (error) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');

            setIsLoggedIn(false);
        }
    }

    useEffect(() => {
        /* Token refresh interceptor */
        console.log("Interceptor ran.");
        const interceptor = axios.interceptors.response.use(
            (response) => response,     
            async (error) => {              
                if (error.response?.status === 401) {
                    await refreshToken();         
                    const access = localStorage.getItem('access_token');
                    error.config.headers.Authorization = `Bearer ${access}`;
                    return axios.request(error.config);  
                }
                return Promise.reject(error); 
            }
        );

        return () => axios.interceptors.response.eject(interceptor);
    }, [refreshToken]);

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, refreshToken }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}