import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext<{
    isLoggedIn: boolean;
    setIsLoggedIn: (value: boolean) => void;
} | null>(null);

export const AuthProvider = ({ children }: {children: React.ReactNode}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(() => 
        localStorage.getItem('is_logged_in') === 'true'
    );

    useEffect(() => {
        localStorage.setItem('is_logged_in', isLoggedIn.toString());
    }, [isLoggedIn]);

    return (
        <AuthContext.Provider value={{isLoggedIn, setIsLoggedIn}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}