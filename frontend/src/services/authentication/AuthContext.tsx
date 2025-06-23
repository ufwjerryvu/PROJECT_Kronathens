import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface AuthContextType {
    isLoggedIn: boolean;
    setIsLoggedIn: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
        return !!localStorage.getItem('access_token');
    });

    useEffect(() => {
        const requestInterceptor = axios.interceptors.request.use(
            (config) => {
                console.log('Request interceptor running');
                const token = localStorage.getItem('access_token');

                if (token && !config.headers.Authorization) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        const responseInterceptor = axios.interceptors.response.use(
            (response) => {
                return response;
            },
            async (error) => {
                const originalRequest = error.config;
            
                
                if (error.response?.status === 401 && !originalRequest._retry) {
                    console.log('401 error detected, attempting token refresh...');
                    originalRequest._retry = true;
                    
                    const refreshToken = localStorage.getItem('refresh_token');
                    
                    if (!refreshToken) {
                        console.log('No refresh token found, redirecting to login');
                        localStorage.removeItem('access_token');
                        localStorage.removeItem('refresh_token');
                        setIsLoggedIn(false);
                        window.location.href = '/login';
                        return Promise.reject(error);
                    }
                    
                    try {
                        console.log('Attempting to refresh token...');
                        const refreshResponse = await axios.post(
                            `${process.env.REACT_APP_API_URL}/users/refresh/`,
                            { refresh: refreshToken },
                            {
                                headers: { 'Content-Type': 'application/json' },
                                transformRequest: [(data, headers) => {
                                    delete headers['Authorization'];
                                    return JSON.stringify(data);
                                }]
                            }
                        );
                        
                        console.log('Token refresh successful');
                        const newAccessToken = refreshResponse.data.access;
                        localStorage.setItem('access_token', newAccessToken);
                        
                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                        
                        return axios(originalRequest);
                        
                    } catch (refreshError: any) {
                        console.error('Token refresh failed:', refreshError.response?.data);
                        
                        if (refreshError.response?.status === 401) {
                            console.log('Refresh token is invalid/expired, redirecting to login');
                            localStorage.removeItem('access_token');
                            localStorage.removeItem('refresh_token');
                            setIsLoggedIn(false);
                            window.location.href = '/login';
                        }
                        
                        return Promise.reject(refreshError);
                    }
                }
                
                return Promise.reject(error);
            }
        );


        return () => {
            axios.interceptors.request.eject(requestInterceptor);
            axios.interceptors.response.eject(responseInterceptor);
        };
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};