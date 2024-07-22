import React, { createContext, useEffect, useMemo } from 'react';
import { auth } from '../firebase/firebase-config';
import { GoogleAuthProvider, signInWithPopup, FacebookAuthProvider } from 'firebase/auth';
import { User } from 'firebase/auth';
import { Outlet, useNavigate } from 'react-router-dom';

export interface AuthContextType {
    user: User | null;
    signInWithGoogle: () => void;
    signInWithFacebook: () => void;
    signOut: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

const ggProvider = new GoogleAuthProvider();
const fbProvider = new FacebookAuthProvider();

function AuthProvider() {
    const navigate = useNavigate();
    const [user, setUser] = React.useState<User | null>(auth.currentUser);

    const signInWithGoogle = () => {
        signInWithPopup(auth, ggProvider).then((result) => {
            console.log('Logged in as:', result.user?.uid);
            navigate('/');
        });
    };
    const signInWithFacebook = () => {
        signInWithPopup(auth, fbProvider).then((result) => {
            console.log('Logged in as:', result.user?.uid);
            navigate('/');
        });
    };
    const signOut = () => {
        auth.signOut().then(() => {
            console.log('Logged out');
            navigate('/login');
        });
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
            if (user) {
                console.log('Logged in as:', user.uid);
            } else {
                console.log('Logged out');
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
