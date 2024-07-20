import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Word } from '../models/wordModel';
import { db } from './firebase-config';

export async function getWord(word: string): Promise<Word | undefined> {
    try {
        const docRef = await getDoc(doc(db, 'words', word));
        return docRef.data() as Word;
    } catch (e) {
        console.error('Error getting document: ', e);
    }
}

export async function addWord(word: Word): Promise<void> {
    try {
        // how to set id for document
        await setDoc(doc(db, 'words', word.name), word);
    } catch (e) {
        console.error('Error adding document: ', e);
    }
}