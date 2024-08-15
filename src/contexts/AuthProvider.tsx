import React, { createContext, useEffect, useMemo, useState } from 'react';
import AuthContextType from '../types/AuthContextType';
import { User } from 'firebase/auth';
import { auth } from '../firebase/firebase-config';
import {
    signInWithGoogle,
    signInWithFacebook,
    signOut,
    authStateChange
} from '../firebase/userAPI';
import { useNavigate } from 'react-router-dom';

interface AuthProviderProps {
    children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType | null>(null);

function AuthProvider(props: AuthProviderProps) {
    const { children } = props;

    const [user, setUser] = useState<User | null>(auth.currentUser);

    const navigate = useNavigate();
    useEffect(() => {
        const unsubscribe = authStateChange((user) => {
            setUser(user);
            if (user) {
                console.log('User logged in: ', user);
                navigate('/');
            } else {
                navigate('/login');
                console.log('User logged out');
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const value = useMemo(() => {
        return {
            user: user ? user : null,
            signInWithGoogle,
            signInWithFacebook,
            signOut
        };
    }, [user]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
export { AuthContext };
