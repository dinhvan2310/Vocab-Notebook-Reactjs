import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase-config';
import { GoogleAuthProvider, signInWithPopup, FacebookAuthProvider, User } from 'firebase/auth';
import { UserType } from '../types/UserType';
import NoAvatar from '../assets/image/no_avatar.png'

const ggProvider = new GoogleAuthProvider();
const fbProvider = new FacebookAuthProvider();

const addUser = async (user: UserType) => {
    if (user === undefined) {
        throw new Error('User is undefined');
    }
    await setDoc(doc(db, 'users', user.id_user??''), user);
};

export const signInWithGoogle = async () => {
    signInWithPopup(auth, ggProvider).then((result) => {
        getDoc(doc(db, 'users', result.user?.uid)).then((doc) => {
            if (!doc.exists()) {
                const user: UserType = {
                    id_user: result.user?.uid,
                    email: result.user?.email ?? '',
                    name: result.user?.displayName ?? '',
                    photoURL: result.user?.photoURL ?? NoAvatar,
                    createAt: Timestamp.fromDate(new Date(result.user?.metadata.creationTime ?? '')),
                    provider: result.user?.providerId ?? 'google.com',
                    folders: [],
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
                    id_user: result.user?.uid,
                    email: result.user?.email ?? '',
                    name: result.user?.displayName ?? '',
                    photoURL: result.user?.photoURL ?? '',
                    createAt: Timestamp.fromDate(new Date(result.user?.metadata.creationTime ?? '')),
                    provider: result.user?.providerId ?? 'facebook.com',
                    folders: [],
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