import { FacebookAuthProvider, GoogleAuthProvider, signInWithPopup, User } from 'firebase/auth';
import { arrayRemove, doc, getDoc, setDoc, Timestamp, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase-config';
import { UserType } from '../types/UserType';
import { WordSetType } from '../types/WordSetType';
import { getWordSet } from './wordSetAPI';

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
                    recentlyWordSet: [],
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
                    recentlyWordSet: [],
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

export const updateRecentlyWordSet = async (wordsetId: string) => {
    const user = auth.currentUser;
    const userRef = doc(db, 'users', user?.uid ?? '');
    const userDoc = await getDoc(userRef);
    const userDocData = userDoc.data() as UserType;
    if (userDocData.recentlyWordSet === undefined) {
        userDocData.recentlyWordSet = [];
    } else if (userDocData.recentlyWordSet.length >= 10) {
        userDocData.recentlyWordSet.shift();
    }
    
    const wordSetRef = doc(db, 'wordsets', wordsetId);
    if (userDocData.recentlyWordSet.map(item => item.id).includes(wordSetRef.id)) {
        userDocData.recentlyWordSet = userDocData.recentlyWordSet.filter((value) => value.id !== wordSetRef.id);
    }
    userDocData.recentlyWordSet = [wordSetRef, ...userDocData.recentlyWordSet];

    await setDoc(userRef, userDocData);
}


export const getRencentlyWordSet = async (limit: number = 10) => {
    console.log('getRencentlyWordSet');
    const user = auth.currentUser;
    const userRef = doc(db, 'users', user?.uid ?? '');
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data() as UserType;
    if (userData.recentlyWordSet === undefined) {
        return [];
    }
    const userList: UserType[] = [];
    const wordSetList: WordSetType[] = [];
    for (const wordSetRef of userData.recentlyWordSet.slice(0, limit)) {
        const wordSet = await getWordSet(wordSetRef.id);
        if(!wordSet) {
            await updateDoc(userRef, {
                recentlyWordSet: arrayRemove(wordSetRef)
            })
        }
        const user = await getUser(wordSet.userRef.id);
        if (wordSet && user) {
            wordSetList.push(wordSet);
            userList.push(user);
        }
    }


    if (wordSetList.length === 0) {
        return [];
    }
    return wordSetList.map((wordSet, index) => {
        return {
            wordSetList: wordSet,
            userList: userList[index],
        }
        });
}