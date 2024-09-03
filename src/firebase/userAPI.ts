import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase-config';
import { GoogleAuthProvider, signInWithPopup, FacebookAuthProvider, User } from 'firebase/auth';
import { UserType } from '../types/UserType';

const ggProvider = new GoogleAuthProvider();
const fbProvider = new FacebookAuthProvider();

const validateUser = (user: UserType) => {
    if (user === undefined) {
        throw new Error('User is undefined');
    }
    if (user.userId === undefined) {
        throw new Error('User ID is undefined');
    }
    if (user.email === undefined) {
        throw new Error('Email is undefined');
    }
    if (user.name === undefined) {
        throw new Error('Name is undefined');
    }
    if (user.provider === undefined) {
        throw new Error('Provider is undefined');
    }
    if (user.createAt === undefined) {
        throw new Error('CreateAt is undefined');
    }
}

const addUser = async (user: UserType) => {
    validateUser(user);

    await setDoc(doc(db, 'users', user.userId??''), user);
};

export const signInWithGoogle = async () => {
    signInWithPopup(auth, ggProvider).then((result) => {
        getDoc(doc(db, 'users', result.user?.uid)).then((doc) => {
            if (!doc.exists()) {
                const user: UserType = {
                    userId: result.user?.uid,
                    email: result.user?.email ?? '',
                    name: result.user?.displayName ?? '',
                    photoURL: result.user?.photoURL ?? '',
                    createAt: Timestamp.fromDate(new Date(result.user?.metadata.creationTime ?? '')),
                    provider: result.user?.providerId ?? 'google.com',
                }
                addUser(user);
                
            }
        });
    });
};
export const signInWithFacebook = async () => {
    signInWithPopup(auth, fbProvider).then((result) => {
        getDoc(doc(db, 'users', result.user?.uid)).then((doc) => {
            if (!doc.exists()) {
                const user: UserType = {
                    userId: result.user?.uid,
                    email: result.user?.email ?? '',
                    name: result.user?.displayName ?? '',
                    photoURL: result.user?.photoURL ?? '',
                    createAt: Timestamp.fromDate(new Date(result.user?.metadata.creationTime ?? '')),
                    provider: result.user?.providerId ?? 'facebook.com',
                }
                addUser(user);
            }
        });
    });
};
export const signOut = () => {
    auth.signOut().then(() => {
    });
};


export const authStateChange = (callback: (user: User | null) => void) => {
    return auth.onAuthStateChanged(callback);
};


export const getUser = async (uid: string): Promise<UserType | undefined> => {
        const docRef = await getDoc(doc(db, 'users', uid));
        return docRef.data() as UserType;
}

export const getCurrentUser = async (): Promise<UserType | undefined> => {
        const user = auth.currentUser;
        if (user) {
            const docRef = await getDoc(doc(db, 'users', user.uid));
            return docRef.data() as UserType;
        }
}