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
    onSnapshot,
    orderBy,
    query,
    Timestamp,
    updateDoc,
    where
} from 'firebase/firestore';
import { WordSetType } from '../types/WordSetType';
import { auth, db } from './firebase-config';
import FolderType from '../types/FolderType';
import { deleteImage } from './utils/uploadImage';
import { WordType } from '../types/WordType';

const validateWordSet = (wordSet: WordSetType) => {
    if (wordSet.name.length > 50) throw new Error('WordSet name is too long');
};

export const addWordSet = async (wordSet: WordSetType) => {
    console.log('addWordSet', wordSet);

    const user = auth.currentUser;
    if (!user) throw new Error('User is not logged in');

    validateWordSet(wordSet);

    const collectionRef = collection(db, 'wordSetsGlobal');
    const folderRef: DocumentReference = typeof wordSet.folderRef === 'string' ? doc(db, 'foldersGlobal', wordSet.folderRef) : wordSet.folderRef;

    // -----------------------------------------------------------------------------------------
    // add wordSet
    const wordSetRef = await addDoc(collectionRef, {
        folderRef: folderRef,
        name: wordSet.name.trim() || '',
        imageUrl: wordSet.imageUrl || '',
        nameLowercase: wordSet.name.trim().toLowerCase() || '',

        visibility: wordSet.visibility || 'public',
        editableBy: wordSet.editableBy || 'owner',
        editablePassword: wordSet.editablePassword || '',
        createAt: wordSet.createAt || Timestamp.now(), 
        modifiedAt: wordSet.modifiedAt || Timestamp.now(),
        words: wordSet.words || [],
    });
    // update wordset array in folder document
    updateDoc(folderRef, {
        wordSets: arrayUnion(wordSetRef)
    });

    return wordSetRef.id;
};

export const updateWordSet = async (
    wordSetId: string, 
    name: string, 
    visibility: 'public' | 'private', 
    editableBy: 'owner' | 'everyone',
    editablePassword: string,
    imageUrl: string, 
    words: WordType[]
) => {
    console.log('updateWordSet');

    const user = auth.currentUser;
    if (!user) throw new Error('User is not logged in');
    if (!wordSetId) throw new Error('WordSet id is not provided');

    const wordSetRef = doc(db, 'wordSetsGlobal', wordSetId);
    const wordSetDoc = await getDoc(wordSetRef);
    if (!wordSetDoc.exists()) throw new Error('WordSet is not found');

    const folderDoc: DocumentData = await getDoc(wordSetDoc.data().folderRef);
    if (!folderDoc.exists()) throw new Error('Folder is not found');

    const folderData: FolderType = folderDoc.data();
    if (folderData.userRef?.id === user.uid) {
        // delete the old image on storage if the new image is different
        if (imageUrl && imageUrl !== wordSetDoc.data().imageUrl) {
            if (wordSetDoc.data().imageUrl) {
                deleteImage(wordSetDoc.data().imageUrl);
            }
        }

        const newWordSet = {
            name: name.trim() || '',
            nameLowercase: name.trim().toLowerCase() || '',
            imageUrl: imageUrl || '',
            visibility: visibility || 'public',
            modifiedAt: Timestamp.now(),
            words: words || [],

            editableBy: editableBy || 'owner',
            editablePassword: editableBy === 'owner' ? '' : editablePassword || '',
        }
        // delete the old image on storage if the new image is different
        for(let i = 0; i < wordSetDoc.data().words.length; i++) {
            if (newWordSet.words[i].imageURL && newWordSet.words[i].imageURL !== wordSetDoc.data().words[i].imageURL) {
                if (wordSetDoc.data().words[i].imageURL) {
                    deleteImage(wordSetDoc.data().words[i].imageURL);
                }
            }
        }
        // update wordset
        updateDoc(wordSetRef, newWordSet);
        // update wordset array in folder document
        updateDoc(wordSetDoc.data().folderRef, {
            wordSets: arrayUnion(wordSetRef)
        });
        

        return newWordSet;
    }
};

export const removeWordSet = async (wordSetId: string) => {
    console.log('removeWordSet', wordSetId);

    const user = auth.currentUser;
    if (!user) throw new Error('User is not logged in');

    if (!wordSetId) throw new Error('WordSet id is not provided');

    const wordSetRef = doc(db, 'wordSetsGlobal', wordSetId);
    const wordSetDoc = await getDoc(wordSetRef);
    
    if (!wordSetDoc.exists()) throw new Error('WordSet is not found');
    const folderDoc: DocumentData = await getDoc(wordSetDoc.data().folderRef);

    if (!folderDoc.exists()) throw new Error('Folder is not found');

    if (folderDoc.data().userRef?.id !== user.uid) throw new Error('You do not have permission to delete this wordSet');
    
    // -----------------------------------------------------------------------------------------
    // delete image from storage if it exists
    if (wordSetDoc.data().imageUrl) {
        deleteImage(wordSetDoc.data().imageUrl);
    }
    // delete wordSet
    wordSetDoc.data().words.forEach(async (word: WordType) => {
        if (word.imageURL) {
            deleteImage(word.imageURL);
        }
    })
    // remove wordSet from wordSets array in folder document
    updateDoc(wordSetDoc.data().folderRef, {
        wordSets: arrayRemove(wordSetRef)
    })

    deleteDoc(wordSetRef);
};


export const getWordSet = async (wordSetId: string) => {
    const wordSetDoc = await getDoc(doc(db, 'wordSetsGlobal', wordSetId));
    if (!wordSetDoc.exists()) throw new Error('WordSet is not found');

    return {
        ...wordSetDoc.data(),
        wordsetId: wordSetDoc.id
    };
};

export const getWordSets = async (
    folderRef: string| DocumentReference | undefined,
    startAt: number = 0,
    limit: number = 10,
    search: string = '',
    sortBy: 'nameLowercase' | 'createAt' | 'modifiedAt' = 'nameLowercase'
) => {
    if (!folderRef) throw new Error('Folder reference is not provided');
    const _folderRef = typeof folderRef === 'string' ? doc(db, 'foldersGlobal', folderRef) : folderRef;

    let q;

    if (search.trim() !== '') {
        q = query(collection(db, 'wordSetsGlobal'),
    where('folderRef', '==', _folderRef), 
        where('nameLowercase', '>=', search.trim().toLowerCase()), 
        where('nameLowercase', '<=', search.trim().toLowerCase() + '\uf8ff'), 
        orderBy(sortBy, sortBy === 'nameLowercase' ? 'asc' : 'desc'),);
    } else {
        q = query(collection(db, 'wordSetsGlobal'),
    where('folderRef', '==', _folderRef), 
        orderBy(sortBy, sortBy === 'nameLowercase' ? 'asc' : 'desc'),);
    }

    const querySnapshot = await getDocs(q);
    const wordSets: WordSetType[] = [];
    querySnapshot.docs.slice(startAt, startAt + limit).forEach((doc) => {
        const wordSet = doc.data() as WordSetType;
        wordSet.wordsetId = doc.id;
        wordSets.push(wordSet);
    })

    return {
        wordSets,
        numOfTotalWordSets: querySnapshot.size
    }
};

export const onSnapshotWordSets = (folderRef: string | DocumentReference | undefined, callback: (wordSets: WordSetType[]) => void) => {
    if (!folderRef) throw new Error('Folder reference is not provided');
    const _folderRef = typeof folderRef === 'string' ? doc(db, 'foldersGlobal', folderRef) : folderRef;
    const q = query(collection(db, 'wordSetsGlobal'), where('folderRef', '==', _folderRef));
    return onSnapshot(q, (snapshot) => {
        const wordSets: WordSetType[] = [];
        snapshot.forEach((doc) => {
            wordSets.push(doc.data() as WordSetType);
        });
        callback(wordSets);
    });
}

export const setWordSetViewMode = (value: 'table' | 'card' | 'list') => {
    const viewMode = localStorage.getItem('wordSetViewMode');
    if (viewMode !== value) {
        localStorage.setItem('wordSetViewMode', value);
    }
}

export const getWordSetViewMode = () => {
    const viewMode = localStorage.getItem('wordSetViewMode');
    if (viewMode === null) {
        localStorage.setItem('wordSetViewMode', 'table');
        return 'table';
    }
    return viewMode as 'table' | 'list' | 'card';
}