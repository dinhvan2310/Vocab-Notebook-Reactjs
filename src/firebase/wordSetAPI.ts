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
import { deleteImage, uploadImage } from './utils/uploadImage';
import { WordType } from '../types/WordType';
import { getWordDefinition } from '../APIs/freeDictionary/freeDictionary';

const validateWordSet = (wordSet: WordSetType) => {
    if (wordSet.name.length > 50) throw new Error('WordSet name is too long');
};

const getWordAudio = async (word: string) => {
    const rs = await getWordDefinition(word.trim().toLowerCase());
    if (rs.message) return '';

    // [
    //     {
    //         "word": "meditate",
    //         "phonetics": [
    //             {
    //                 "audio": "https://api.dictionaryapi.dev/media/pronunciations/en/meditate-us.mp3",
    //                 "sourceUrl": "https://commons.wikimedia.org/w/index.php?curid=1780214",
    //                 "license": {
    //                     "name": "BY-SA 3.0",
    //                     "url": "https://creativecommons.org/licenses/by-sa/3.0"
    //                 }
    //             }
    //         ],
    //         "meanings": [
    //             {
    //                 "partOfSpeech": "verb",
    //                 "definitions": [
    //                     {
    //                         "definition": "To contemplate; to keep the mind fixed upon something; to study.",
    //                         "synonyms": [],
    //                         "antonyms": []
    //                     },
    //                     {
    //                         "definition": "To sit or lie down and come to a deep rest while still remaining conscious.",
    //                         "synonyms": [],
    //                         "antonyms": []
    //                     },
    //                     {
    //                         "definition": "To consider; to reflect on.",
    //                         "synonyms": [],
    //                         "antonyms": []
    //                     }
    //                 ],
    //                 "synonyms": [],
    //                 "antonyms": []
    //             }
    //         ],
    //         "license": {
    //             "name": "CC BY-SA 3.0",
    //             "url": "https://creativecommons.org/licenses/by-sa/3.0"
    //         },
    //         "sourceUrls": [
    //             "https://en.wiktionary.org/wiki/meditate"
    //         ]
    //     }
    // ]

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return rs.find((w: { phonetics: any[]; }) => w.phonetics.find((p: { audio: any; }) => p.audio))?.phonetics.find((p: { audio: any; }) => p.audio)?.audio || '';
}

export const addWordSet = async (wordSet: WordSetType) => {
    console.log('addWordSet', wordSet);

    const user = auth.currentUser;
    if (!user) throw new Error('User is not logged in');

    validateWordSet(wordSet);

    const collectionRef = collection(db, 'wordSetsGlobal');
    const folderRef: DocumentReference = typeof wordSet.folderRef === 'string' ? doc(db, 'foldersGlobal', wordSet.folderRef) : wordSet.folderRef;


    const imageUrl = wordSet.imageUrl === '' ? '' :
        typeof wordSet.imageUrl === 'string' ?  wordSet.imageUrl : 
        await uploadImage(wordSet.imageUrl)
    // -----------------------------------------------------------------------------------------
    const newWords = await Promise.all(wordSet.words.map(async (word) => {
        return {
            ...word,
            audio: await getWordAudio(word.name),
            imageURL: typeof word.imageURL === 'string' ? word.imageURL : await uploadImage(word.imageURL)
        }
    }));
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
        words:newWords
    }
    console.log('newWordSet', newWordSet);
    // add wordSet
    const wordSetRef = await addDoc(collectionRef, newWordSet);
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
    imageUrl: string | File, 
    words: WordType[]
) : Promise<string> => {
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
        const _imageUrl = typeof imageUrl === 'string' ? imageUrl : await uploadImage(imageUrl)
        // delete the old image on storage if the new image is different
        if (_imageUrl && _imageUrl !== wordSetDoc.data().imageUrl) {
            if (wordSetDoc.data().imageUrl) {
                deleteImage(wordSetDoc.data().imageUrl);
            }
        }

        const newWords = await Promise.all(words.map(async (word) => {
            return {
                ...word,
                imageURL: typeof word.imageURL === 'string' ? word.imageURL : await uploadImage(word.imageURL)
            }
        }));

        const newWordSet = {
            name: name.trim() || '',
            nameLowercase: name.trim().toLowerCase() || '',
            imageUrl: _imageUrl || '',
            visibility: visibility || 'public',
            modifiedAt: Timestamp.now(),
            words: newWords || [],

            editableBy: editableBy || 'owner',
            editablePassword: editableBy === 'owner' ? '' : editablePassword || '',
        }
        // delete the old image on storage if the new image is different
        for(let i = 0; i < wordSetDoc.data().words.length; i++) {
            if (wordSetDoc.data().words[i].imageURL && newWordSet.words[i].imageURL !== wordSetDoc.data().words[i].imageURL) {
                    deleteImage(wordSetDoc.data().words[i].imageURL);
            }
        }
        // update wordset
        updateDoc(wordSetRef, newWordSet);
        // update wordset array in folder document
        updateDoc(wordSetDoc.data().folderRef, {
            wordSets: arrayUnion(wordSetRef)
        });
        

        return wordSetRef.id;
    }
    else {
        throw new Error('You do not have permission to update this wordSet');
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
        console.log('deleteImageCoverWordSet');
        deleteImage(wordSetDoc.data().imageUrl);
    }
    // delete wordSet
    wordSetDoc.data().words.forEach(async (word: WordType) => {
        const imageUrl = typeof word.imageURL === 'string' ? word.imageURL : await uploadImage(word.imageURL)
        if (imageUrl) {
            console.log('deleteImageWordSet');
            deleteImage(imageUrl);
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
    } as WordSetType;
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

export const updateWord = async (
    wordSetId: string, 
    wordId: string, 
    imageURL?: string, 
    meaning?: string,
    contexts?: string[],
    name?: string,
    learned?: boolean,
    audio?: string
) => {
    console.log('updateWord', wordSetId, wordId, learned, audio, contexts, imageURL, meaning, name);

    const user = auth.currentUser;
    if (!user) throw new Error('User is not logged in');

const wordSetRef = doc(db, 'wordSetsGlobal', wordSetId);
    const wordSetDoc = await getDoc(wordSetRef);
    if (!wordSetDoc.exists()) throw new Error('WordSet is not found');

    const oldWord = wordSetDoc.data().words.find((word: WordType) => word.name === wordId.trim().toLowerCase());
    if (!oldWord) throw new Error('Word is not found');

    const updateWord = {
        imageURL: imageURL || '',
        meaning: meaning || oldWord.meaning,
        contexts: contexts || [],
        name: name?.trim().toLowerCase() || oldWord.name,
        learned: learned === undefined ? oldWord.learned : learned,
        audio: audio || oldWord.audio
    }

    if (imageURL && imageURL !== oldWord.imageURL) {
        if (oldWord.imageURL) {
            deleteImage(oldWord.imageURL);
        }
    }

    const newWords = wordSetDoc.data().words.map((word: WordType) => {
        if (word.name === wordId.trim().toLowerCase()) {
            return updateWord;
        }
        return word;
    });

    await updateDoc(wordSetRef, {
        words: newWords
    });

    return wordId;
}
