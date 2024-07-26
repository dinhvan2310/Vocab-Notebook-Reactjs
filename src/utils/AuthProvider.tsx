import React, { createContext, useEffect, useMemo } from 'react';
import { auth } from '../firebase/firebase-config';
import {
    signInWithGoogle,
    signInWithFacebook,
    signOut,
    authStateChange
} from '../firebase/userAPI';
import { User } from 'firebase/auth';
import { Outlet, useNavigate } from 'react-router-dom';

export interface AuthContextType {
    user: User | null;
    signInWithGoogle: () => void;
    signInWithFacebook: () => void;
    signOut: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

function AuthProvider() {
    const navigate = useNavigate();
    const [user, setUser] = React.useState<User | null>(auth.currentUser);

    useEffect(() => {
        const unsubscribe = authStateChange((user) => {
            setUser(user);
            if (user) {
                navigate('/');
            } else {
                navigate('/login');
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

    return (
        <AuthContext.Provider value={value}>
            <Outlet />
        </AuthContext.Provider>
    );
}

export default AuthProvider;
