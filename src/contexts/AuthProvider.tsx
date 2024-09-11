import { User } from 'firebase/auth';
import React, { createContext, useEffect, useMemo, useState } from 'react';
import {
    authStateChange,
    signInWithFacebook,
    signInWithGoogle,
    signInWithEmailLink,
    signOut
} from '../firebase/userAPI';
import AuthContextType from '../types/AuthContextType';

interface AuthProviderProps {
    children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType | null>(null);

function AuthProvider(props: AuthProviderProps) {
    const { children } = props;
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = authStateChange((user) => {
            setUser(user ?? null);
            if (user) {
                console.log('User logged in');
            } else {
                console.log('User logged out');
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const value = useMemo(() => {
        return {
            user,
            signInWithGoogle,
            signInWithFacebook,
            signInWithEmailLink,
            signOut
        };
    }, [user]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
export { AuthContext };
