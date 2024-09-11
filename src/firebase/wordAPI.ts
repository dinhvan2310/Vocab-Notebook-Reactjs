// import { doc, getDoc } from "firebase/firestore";
// import { auth, db } from "./firebase-config";

import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, Timestamp, updateDoc, where } from 'firebase/firestore';
import { WordType } from '../types/WordType';
import { auth, db } from './firebase-config';
import { deleteImage, uploadImage } from './utils/uploadImage';
import { WordGlobalType } from '../types/WordGlobalType';

// export const addWord = async (word: WordType) => {
//     const user = auth.currentUser;
//     if (!user) throw new Error("User is not logged in");

//     const docRef = doc(db, "words", "wordId");
//     const docSnap = await getDoc(docRef);
//     if (docSnap.exists()) {
//         console.log("Document data:", docSnap.data());
//     }
// }

/// contexts, meaning, name, imageURL, 
export const addWord = async (wordSetId: string, word: WordType) => {
    const user = auth.currentUser;
    if (!user) throw new Error('User is not logged in');

    console.log('addWord', word);

    const wordSetRef = doc(db, 'wordSets', wordSetId);
    const wordSetDoc = await getDoc(wordSetRef);

    if (!wordSetDoc.exists()) throw new Error('WordSet not found');

    // const wordDoc = await getDoc(
    //     doc(db, 'words', `${wordSetId}_${word.name.trim().toLowerCase()}`)
    // );
    // if (wordDoc.exists()) throw new Error('Word already exists');

    const wordRef = doc(db, 'words', `${wordSetId}_${word.name.trim().toLowerCase()}`);
    setDoc(wordRef, {
        contexts: word.contexts,
        meaning: word.meaning.trim(),
        imageURL: typeof word.imageURL === 'string' ? word.imageURL : await uploadImage(word.imageURL),
        name: word.name.trim().toLowerCase(),
        wordSetRef: wordSetRef,
        wordId: `${wordSetId}_${word.name}`,
        createdAt: Timestamp.now(),
        learned: false
    });

    // updateWordGlobal(word);
    updateWordGlobal(word);

    return wordRef
};

export const updateWord = async (wordId: string, name?: string, meaning?: string, contexts?: string[], imageURL?: string, learned?: boolean) => {
    const user = auth.currentUser;
    if (!user) throw new Error('User is not logged in');

    console.log('updateWord', wordId, name, meaning, contexts, imageURL, learned);

    if (!wordId) throw new Error('WordId is not defined');

    const wordDoc = await getDoc(doc(db, 'words', wordId));
    if (!wordDoc.exists()) throw new Error('Word not found');

    const wordData = wordDoc.data() as WordType;
    
    let _imageUrl: string | undefined = imageURL
    if (_imageUrl !== undefined) {
        _imageUrl = typeof imageURL === 'string' ? imageURL : await uploadImage(imageURL);

        if (wordData.imageURL !== _imageUrl) {
            deleteImage(wordData.imageURL as string);
        }
    }

    updateDoc(doc(db, 'words', wordId), {
        contexts: contexts === undefined ? wordData.contexts : contexts,
        meaning: meaning === undefined ? wordData.meaning : meaning,
        imageURL: imageURL === undefined ? wordData.imageURL : imageURL,
        name: name === undefined ? wordData.name : name.trim().toLowerCase(),
        learned: learned === undefined ? wordData.learned : learned
    })

    updateWordGlobal({
        contexts: contexts === undefined ? wordData.contexts : contexts,
        meaning: meaning === undefined ? wordData.meaning : meaning,
        imageURL: imageURL === undefined ? wordData.imageURL : imageURL,
        name: name === undefined ? wordData.name : name.trim().toLowerCase(),
    })
}

export const getWords = async (
    wordSetId: string,
) => {


    const wordSetRef = doc(db, 'wordSets', wordSetId);
    const wordSetDoc = await getDoc(wordSetRef);

    if (!wordSetDoc.exists()) throw new Error('WordSet not found');

    const wordsRef = collection(db, 'words');
    const q = query(wordsRef, where('wordSetRef', '==', wordSetRef));

    const querySnapshot = await getDocs(q);
    const words: WordType[] = [];
    querySnapshot.forEach((doc) => {
        words.push(doc.data() as WordType);
    });
    return words;
};

export const removeWord = async (wordId: string) => {
    const user = auth.currentUser;
    if (!user) throw new Error('User is not logged in');

    const wordRef = doc(db, 'words', wordId);
    const wordDoc = await getDoc(wordRef);
    if (!wordDoc.exists()) throw new Error('Word not found');

    const wordData = wordDoc.data() as WordType;

    deleteImage(wordData.imageURL as string);

    return deleteDoc(wordRef);
}


// Word Global API 

export const updateWordGlobal = async (word: WordType) => {
    const user = auth.currentUser;
    if (!user) throw new Error('User is not logged in');

    console.log('updateWordGlobal', word);

    const wordGlobalRef = doc(db, 'wordGlobals', word.name.trim().toLowerCase());
    const wordGlobalDoc = await getDoc(wordGlobalRef);

    if (!wordGlobalDoc.exists()) {
        setDoc(wordGlobalRef, {
            name: word.name.trim().toLowerCase(),
            meanings: [
                {
                    meaning: word.meaning.trim(),
                    lastUsedAt: Timestamp.now(),
                    usageCount: 1
                }
            ],
            contexts: word.contexts,
            imageUrl: [
                word.imageURL
            ]
        })
    } else {
        const wordGlobalData = wordGlobalDoc.data() as WordGlobalType;

        let isUsedMeaning = false;
        const _meanings = wordGlobalData.meanings.map(meaning => {
            if (meaning.meaning.trim().toLowerCase() === word.meaning.trim().toLowerCase()){
                isUsedMeaning = true;
                return {
                    meaning: meaning.meaning,
                    lastUsedAt: Timestamp.now(),
                    usageCount: meaning.usageCount + 1
                }
            }
            return meaning
        });
        if (!isUsedMeaning) {
            _meanings.push({
                meaning: word.meaning.trim(),
                lastUsedAt: Timestamp.now(),
                usageCount: 1
            })
        }

        const _contexts = wordGlobalData.contexts.concat(word.contexts).filter((value, index, self) => self.indexOf(value) === index);
        const wordImageUrl: string = typeof word.imageURL === 'string' ? word.imageURL : await uploadImage(word.imageURL) as string;
        const _imageUrl = wordGlobalData.imageUrl.concat(wordImageUrl).filter((value, index, self) => self.indexOf(value) === index);

    

        updateDoc(wordGlobalRef, {
            meanings: _meanings,
            contexts: _contexts,
            imageUrl: _imageUrl
        })
    }
}