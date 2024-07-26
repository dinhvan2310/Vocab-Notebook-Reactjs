import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase-config';
import { GoogleAuthProvider, signInWithPopup, FacebookAuthProvider, User } from 'firebase/auth';

const ggProvider = new GoogleAuthProvider();
const fbProvider = new FacebookAuthProvider();

const addUser = async (user: User) => {
    await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL
    });
};

export const signInWithGoogle = () => {
    signInWithPopup(auth, ggProvider).then((result) => {
        getDoc(doc(db, 'users', result.user?.uid)).then((doc) => {
            if (!doc.exists()) {
                addUser(result.user);
            }
        });
    });
};
export const signInWithFacebook = () => {
    signInWithPopup(auth, fbProvider).then((result) => {
        getDoc(doc(db, 'users', result.user?.uid)).then((doc) => {
            if (!doc.exists()) {
                addUser(result.user);
            }
        });
    });
};
export const signOut = () => {
    auth.signOut().then(() => {
        console.log('Logged out');
    });
};
export const authStateChange = (callback: (user: User | null) => void) => {
    return auth.onAuthStateChanged(callback);
};


export const getUser = async (uid: string): Promise<User | undefined> => {
    try {
        const docRef = await getDoc(doc(db, 'users', uid));
        return docRef.data() as User;
    } catch (e) {
        console.error('Error getting document: ', e);
    }
}