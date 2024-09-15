import {
    addDoc,
    arrayRemove,
    arrayUnion,
    collection,
    deleteDoc,
    doc,
    DocumentData,
    DocumentReference,
    getDoc,
    getDocs,
    limit,
    onSnapshot,
    orderBy,
    query,
    Timestamp,
    updateDoc,
    where
} from 'firebase/firestore';
import FolderType from '../types/FolderType';
import { UserType } from '../types/UserType';
import { WordSetType } from '../types/WordSetType';
import { WordType } from '../types/WordType';
import { auth, db } from './firebase-config';
import { getUser } from './userAPI';
import { deleteImage, uploadImage } from './utils/uploadImage';
import { addWord } from './wordAPI';

export const addWordSet = async (wordSet: WordSetType, words: WordType[]) => {

    const user = auth.currentUser;
    if (!user) throw new Error('User is not logged in');

    // meta data
    const collectionRef = collection(db, 'wordSets');
    const folderRef: DocumentReference =
        typeof wordSet.folderRef === 'string'
            ? doc(db, 'folders', wordSet.folderRef)
            : wordSet.folderRef;

    // check if user has permission to add wordSet to the folder
    const folderDoc: DocumentData = await getDoc(folderRef);
    if (!folderDoc.exists()) throw new Error('Folder is not found');
    if (folderDoc.data().userRef?.id !== user.uid)
        throw new Error('You do not have permission to add wordSet to this folder');

    // create new wordSet
    const imageUrl =
        wordSet.imageUrl === ''
            ? ''
            : typeof wordSet.imageUrl === 'string'
            ? wordSet.imageUrl
            : await uploadImage(wordSet.imageUrl);
    const newWordSet = {
        folderRef: folderRef,
        name: wordSet.name.trim() || '',
        nameLowercase: wordSet.name.trim().toLowerCase() || '',
        imageUrl: imageUrl,

        visibility: wordSet.visibility || 'public',
        editableBy: wordSet.editableBy || 'owner',
        editablePassword: wordSet.editablePassword || '',
        createAt: wordSet.createAt || Timestamp.now(),
        modifiedAt: wordSet.modifiedAt || Timestamp.now(),
        words: [],
        star: [],
        userRef: doc(db, 'users', user.uid)
    };
    // add new wordSet
    const wordSetRef = await addDoc(collectionRef, newWordSet);
    // update wordset array in folder document
    updateDoc(folderRef, {
        wordSets: arrayUnion(wordSetRef)
    });

    // add words to the wordSet
    const newWordRefs = await Promise.all(
        words.map(async (word) => {
            const imageUrl =
                typeof word.imageURL === 'string'
                    ? word.imageURL
                    : await uploadImage(word.imageURL);
            return await addWord(wordSetRef.id, {
                ...word,
                imageURL: imageUrl,
                learned: false
            });
        })
    );
    // update wordSet with words
    updateDoc(wordSetRef, {
        words: newWordRefs
    });

    return wordSetRef.id;
};

export const updateWordSetStarCount = async (wordSetId: string) => {
    const user = auth.currentUser;
    if (!user) throw new Error('User is not logged in');

    const wordSetRef = doc(db, 'wordSets', wordSetId);
    const wordSetDoc = await getDoc(wordSetRef);
    if (!wordSetDoc.exists()) throw new Error('WordSet is not found');
    const wordSetData = wordSetDoc.data() as WordSetType;
    if (wordSetData.star === undefined) throw new Error('Star count is not found');

    const userRef = doc(db, 'users', user.uid);

    console.log('star', wordSetData.star, userRef);
    if (wordSetData.star.map(item => item.id).includes(userRef.id)) {
        console.log('remove star');
        updateDoc(wordSetRef, {
            star: arrayRemove(userRef)
        });
    } else {
        console.log('add star');
        updateDoc(wordSetRef, {
            star: arrayUnion(userRef)
        });
    }
}
export const updateWordSetEditableBy = async ( wordSetId: string, editableBy: 'owner' | 'everyone' , password: string) => {
    console.log('updateWordSetEditableBy', wordSetId, editableBy, password);

    const user = auth.currentUser;
    if (!user) throw new Error('User is not logged in');
    if (!wordSetId) throw new Error('WordSet id is not provided');

    const wordSetRef = doc(db, 'wordSets', wordSetId);
    const wordSetDoc = await getDoc(wordSetRef);
    if (!wordSetDoc.exists()) throw new Error('WordSet is not found');

    if (editableBy === 'everyone' && password === '') {
        throw new Error('Password is required');
    }

    // check if user has permission to add wordSet to the folder
    const folderDoc: DocumentData = await getDoc(wordSetDoc.data().folderRef);
    if (!folderDoc.exists()) throw new Error('Folder is not found');
    if (folderDoc.data().userRef?.id !== user.uid)
        throw new Error('You do not have permission to add wordSet to this folder');

    updateDoc(wordSetRef, {
        editableBy: editableBy,
        editablePassword: password
    });

    return wordSetRef.id;
}
const checkPassword = async (wordSetId: string, password: string) => {
    const wordSetRef = doc(db, 'wordSets', wordSetId);
    const wordSetDoc = await getDoc(wordSetRef);
    if (!wordSetDoc.exists()) throw new Error('WordSet is not found');
    const user = auth.currentUser;
    if (!user) throw new Error('User is not logged in');

    const folderDoc: DocumentData = await getDoc(wordSetDoc.data().folderRef);
    if (!folderDoc.exists()) throw new Error('Folder is not found');

    if (folderDoc.data().userRef?.id === user.uid)
        return true;

    if (wordSetDoc.data().editableBy === 'owner') return false;
    
    console.log('password', password, 'pass' , wordSetDoc.data().editablePassword);
    if (password !== wordSetDoc.data().editablePassword) {
        return false;
    }
    return true;
}
export const updateWordSet = async (
    wordSetId: string,
    name: string,
    visibility: 'public' | 'private',
    imageUrl: string | File,
): Promise<string> => {
    console.log('updateWordSet');

    const user = auth.currentUser;
    if (!user) throw new Error('User is not logged in');
    if (!wordSetId) throw new Error('WordSet id is not provided');

    const wordSetRef = doc(db, 'wordSets', wordSetId);
    const wordSetDoc = await getDoc(wordSetRef);
    if (!wordSetDoc.exists()) throw new Error('WordSet is not found');

    
    const folderDoc: DocumentData = await getDoc(wordSetDoc.data().folderRef);
    // check if user has permission to add wordSet to the folder
    if (!folderDoc.exists()) throw new Error('Folder is not found');
    if (folderDoc.data().userRef?.id !== user.uid)
        throw new Error('You do not have permission to add wordSet to this folder');

    const _imageUrl = typeof imageUrl === 'string' ? imageUrl : await uploadImage(imageUrl);
    // delete the old image on storage if the new image is different
    if (_imageUrl && _imageUrl !== wordSetDoc.data().imageUrl) {
        if (wordSetDoc.data().imageUrl) {
            await deleteImage(wordSetDoc.data().imageUrl);
        }
    }

    const newWordSet = {
        name: name.trim() || '',
        nameLowercase: name.trim().toLowerCase() || '',
        imageUrl: _imageUrl || '',
        visibility: visibility || 'public',
        modifiedAt: Timestamp.now(),

        words: wordSetDoc.data().words,
        editableBy: wordSetDoc.data().editableBy,
        editablePassword: wordSetDoc.data().editablePassword,
        userRef: wordSetDoc.data().userRef,
    };

    
    // update wordset
    updateDoc(wordSetRef, newWordSet);
    // update wordset array in folder document
    updateDoc(wordSetDoc.data().folderRef, {
        wordSets: arrayUnion(wordSetRef)
    });

    return wordSetRef.id;
};

export const updateWords = async (wordSetId: string, words: WordType[], password: string) => {
    const user = auth.currentUser;
    if (!user) throw new Error('User is not logged in');
    if (!wordSetId) throw new Error('WordSet id is not provided');

    const wordSetRef = doc(db, 'wordSets', wordSetId);
    const wordSetDoc = await getDoc(wordSetRef);
    if (!wordSetDoc.exists()) throw new Error('WordSet is not found');

    if (!(await checkPassword(wordSetId, password ?? ''))) {
        console.log('Password is incorrect');
        throw new Error('Password is incorrect');
    }
    
    const oldWords = wordSetDoc.data().words;
    oldWords.forEach(async (wordRef: DocumentReference) => {
        const word = (await getDoc(wordRef)).data() as WordType;
        const imageUrl =
            typeof word.imageURL === 'string' ? word.imageURL : await uploadImage(word.imageURL);
        if (imageUrl) {
            deleteImage(imageUrl);
        }
        deleteDoc(wordRef);
    })

    const newWordRefs = await Promise.all(
        words.map(async (word) => {
            const imageUrl =
                typeof word.imageURL === 'string'
                    ? word.imageURL
                    : await uploadImage(word.imageURL);
            return await addWord(wordSetRef.id, {
                ...word,
                imageURL: imageUrl,
            });
        })
    );

    // update wordSet with words
    updateDoc(wordSetRef, {
        words: newWordRefs
    });
    return wordSetRef.id;
}

// -----------------------
export const removeWordSet = async (wordSetId: string) => {
    console.log('removeWordSet', wordSetId);

    // check conditions ---------------------------------------------------
    const user = auth.currentUser;
    if (!user) throw new Error('User is not logged in');
    
    if (!wordSetId) throw new Error('WordSet id is not provided');

    const wordSetRef = doc(db, 'wordSets', wordSetId);
    const wordSetDoc = await getDoc(wordSetRef);

    if (!wordSetDoc.exists()) throw new Error('WordSet is not found');
    const folderDoc: DocumentData = await getDoc(wordSetDoc.data().folderRef);

    if (!folderDoc.exists()) throw new Error('Folder is not found');

    if (folderDoc.data().userRef?.id !== user.uid)
        throw new Error('You do not have permission to delete this wordSet');

    // -----------------------------------------------------------------------------------------
    // delete image from storage if it exists
    if (wordSetDoc.data().imageUrl) {
        console.log('deleteImageCoverWordSet');
        deleteImage(wordSetDoc.data().imageUrl);
    }
    // delete wordSet
    wordSetDoc.data().words.forEach(async (wordRef: DocumentReference) => {
        const word = (await getDoc(wordRef)).data() as WordType;
        const imageUrl =
            typeof word.imageURL === 'string' ? word.imageURL : await uploadImage(word.imageURL);
        if (imageUrl) {
            console.log('deleteImageWordSet');
            deleteImage(imageUrl);
        }
        deleteDoc(wordRef);
    });
    // remove wordSet from wordSets array in folder document
    updateDoc(wordSetDoc.data().folderRef, {
        wordSets: arrayRemove(wordSetRef)
    });

    deleteDoc(wordSetRef);
};





















export const getWordSet = async (wordSetId: string) => {
    const user = auth.currentUser;


    const wordSetDoc = await getDoc(doc(db, 'wordSets', wordSetId));
    if (!wordSetDoc.exists()) throw new Error('WordSet is not found');

    const folderDoc = await getDoc(wordSetDoc.data().folderRef);
    if (!folderDoc.exists()) throw new Error('Folder is not found');
    const folderData = folderDoc.data() as FolderType;

    let isPermitted = false;
    if (folderData.userRef?.id === user?.uid) {
        isPermitted = true;
    }

    if (!isPermitted && wordSetDoc.data().visibility !== 'public') {
        throw new Error('You do not have permission to view this wordSet');
    }

    

    return {
        ...wordSetDoc.data(),
        wordsetId: wordSetDoc.id
    } as WordSetType;
};

export const getWordSets = async (
    folderRef: string | DocumentReference | undefined,
    startAt: number = 0,
    limit: number = 10,
    search: string = '',
    sortBy: 'nameLowercase' | 'createAt' | 'modifiedAt' = 'nameLowercase'
) => {
    const user = auth.currentUser;

    if (!folderRef) throw new Error('Folder reference is not provided');
    const _folderRef = typeof folderRef === 'string' ? doc(db, 'folders', folderRef) : folderRef;

    const folderDoc = await getDoc(_folderRef);
    if (!folderDoc.exists()) throw new Error('Folder is not found');

    let isPermitted = false;
    const folderData = folderDoc.data() as FolderType;
    if (folderData.userRef?.id === user?.uid) {
        isPermitted = true;
    }


    let q;

    if (search.trim() !== '') {
        q = query(
            collection(db, 'wordSets'),
            where('folderRef', '==', _folderRef),
            where('nameLowercase', '>=', search.trim().toLowerCase()),
            where('nameLowercase', '<=', search.trim().toLowerCase() + '\uf8ff'),
            orderBy(sortBy, sortBy === 'nameLowercase' ? 'asc' : 'desc')
        );
    } else {
        q = query(
            collection(db, 'wordSets'),
            where('folderRef', '==', _folderRef),
            orderBy(sortBy, sortBy === 'nameLowercase' ? 'asc' : 'desc')
        );
    }

    if (!isPermitted) {
        q = query(q, where('visibility', '==', 'public'));
    }

    const querySnapshot = await getDocs(q);
    const wordSets: WordSetType[] = [];
    querySnapshot.docs.slice(startAt, startAt + limit).forEach((doc) => {
        const wordSet = doc.data() as WordSetType;
        wordSet.wordsetId = doc.id;
        wordSets.push(wordSet);
    });

    return {
        wordSets,
        numOfTotalWordSets: querySnapshot.size
    };
};

export const onSnapshotWordSets = (
    folderRef: string | DocumentReference | undefined,
    callback: (wordSets: WordSetType[]) => void
) => {

    if(folderRef === undefined) {
    const q = query(collection(db, 'wordSets'));
    return onSnapshot(q, (snapshot) => {
        const wordSets: WordSetType[] = [];
        snapshot.forEach((doc) => {
            wordSets.push(doc.data() as WordSetType);
        });
        callback(wordSets);
    });
    }

    const _folderRef = typeof folderRef === 'string' ? doc(db, 'folders', folderRef) : folderRef;
    const q = query(collection(db, 'wordSets'), where('folderRef', '==', _folderRef));
    return onSnapshot(q, (snapshot) => {
        const wordSets: WordSetType[] = [];
        snapshot.forEach((doc) => {
            wordSets.push(doc.data() as WordSetType);
        });
        callback(wordSets);
    });
};

export const setWordSetViewMode = (value: 'table' | 'card' | 'list') => {
    const viewMode = localStorage.getItem('wordSetViewMode');
    if (viewMode !== value) {
        localStorage.setItem('wordSetViewMode', value);
    }
};

export const getWordSetViewMode = () => {
    const viewMode = localStorage.getItem('wordSetViewMode');
    if (viewMode === null) {
        localStorage.setItem('wordSetViewMode', 'table');
        return 'table';
    }
    return viewMode as 'table' | 'list' | 'card';
};


// export const getWordSetsRecent = async (userid: string, _limit: number = 10) => {
//     const user = auth.currentUser;
//     if (!user) throw new Error('User is not logged in');

//     if (userid !== user.uid) throw new Error('User id is not matched');
//     const userRef = doc(db, 'users', userid);
//     const folderRefs: DocumentReference[] = [];
//     const folderQuerySnapshot = await getDocs(
//         query(collection(db, 'folders'), where('userRef', '==', userRef))
//     );
//     folderQuerySnapshot.forEach((doc) => {
//         folderRefs.push(doc.ref);
//     });
    
//     const q = query(
//         collection(db, 'wordSets'),
//         where('folderRef', 'in', folderRefs),
//         orderBy('modifiedAt', 'desc'),
//         limit(_limit)
//     );

//     const querySnapshot = await getDocs(q);
//     const wordSets: WordSetType[] = [];
//     querySnapshot.forEach((doc) => {
//         const wordSet = doc.data() as WordSetType;
//         wordSet.wordsetId = doc.id;
//         wordSets.push(wordSet);
//     });

//     return wordSets;
// }

export const getPopularWordSets = async (l: number = 10) => {
    const q = query(collection(db, 'wordSets'), orderBy('star', 'desc'), limit(l));
    const querySnapshot = await getDocs(q);

    const wordSetList: WordSetType[] = [];
    const userList: UserType[] = [];
    const promises = querySnapshot.docs.map(async (doc) => {
        const wordSet = doc.data() as WordSetType;
        wordSet.wordsetId = doc.id;
        console.log(wordSet.star?.length)
        const user = await getUser(wordSet.userRef.id)
        if (user) {
            wordSetList.push(wordSet);
            userList.push(user);
        }
    });
    await Promise.all(promises);

    return wordSetList.map((wordSet, index) => {
        return {
            wordSetList: wordSet,
            userList: userList[index]
        };
    });
}