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
import { WordType } from '../types/WordType';
import { auth, db } from './firebase-config';
import { deleteImage, uploadImage } from './utils/uploadImage';
import { addWord } from './wordAPI';

export const addWordSet = async (wordSet: WordSetType, words: WordType[]) => {
    console.log('addWordSet', wordSet);
    console.log('addWordSet', words);

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
        words: []
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
                createdAt: Timestamp.now(),
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

export const updateWordSet = async (
    wordSetId: string,
    name: string,
    visibility: 'public' | 'private',
    editableBy: 'owner' | 'everyone',
    editablePassword: string,
    imageUrl: string | File,
    words: WordType[] | undefined
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
            deleteImage(wordSetDoc.data().imageUrl);
        }
    }

    // const newWords = await Promise.all(
    //     words.map(async (word) => {
    //         return {
    //             ...word,
    //             imageURL:
    //                 typeof word.imageURL === 'string'
    //                     ? word.imageURL
    //                     : await uploadImage(word.imageURL)
    //         };
    //     })
    // );

    // add words to the wordSet
    const newWordRefs = words === undefined ? undefined : await Promise.all(
        words.map(async (word) => {
            const imageUrl =
                typeof word.imageURL === 'string'
                    ? word.imageURL
                    : await uploadImage(word.imageURL);
            return await addWord(wordSetRef.id, {
                meaning: word.meaning.trim(),
                contexts: word.contexts,
                name: word.name.trim().toLowerCase(),
                imageURL: imageUrl,
            });
        })
    );

    const newWordSet = {
        name: name.trim() || '',
        nameLowercase: name.trim().toLowerCase() || '',
        imageUrl: _imageUrl || '',
        visibility: visibility || 'public',
        modifiedAt: Timestamp.now(),
        words: newWordRefs === undefined ? wordSetDoc.data().words : newWordRefs,

        editableBy: editableBy || 'owner',
        editablePassword: editableBy === 'owner' ? '' : editablePassword || ''
    };

    // delete the old image on storage if the new image is different
    if (words !== undefined) {
        const oldWords = wordSetDoc.data().words;
    for (let i = 0; i < oldWords.length; i++) {
        const oldWord = (await getDoc(oldWords[i])).data() as WordType;
        if (oldWord.imageURL) {
            if (typeof oldWord.imageURL === 'string' && oldWord.imageURL  && oldWord.imageURL !== words[i].imageURL) {
                deleteImage(oldWord.imageURL);
            }
        }
    }
    }
    // update wordset
    updateDoc(wordSetRef, newWordSet);
    // update wordset array in folder document
    updateDoc(wordSetDoc.data().folderRef, {
        wordSets: arrayUnion(wordSetRef)
    });

    console.log('updateWordSet', wordSetId);

    return wordSetRef.id;
};


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
    const wordSetDoc = await getDoc(doc(db, 'wordSets', wordSetId));
    if (!wordSetDoc.exists()) throw new Error('WordSet is not found');

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
    if (!folderRef) throw new Error('Folder reference is not provided');
    const _folderRef = typeof folderRef === 'string' ? doc(db, 'folders', folderRef) : folderRef;

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
    if (!folderRef) throw new Error('Folder reference is not provided');
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


