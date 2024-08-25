import { addDoc, arrayUnion, collection, doc, getDoc, getDocs, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { WordSetType } from "../types/WordSetType";
import { auth, db } from "./firebase-config";

export const addWordSet = async (wordSet: WordSetType) => {
    const user = auth.currentUser;
    if (!user) throw new Error("User is not logged in");

    // add wordSet to database
    const wordSetRef = await addDoc(collection(db, "wordSets"), wordSet);

    // add wordSet to folder word_sets array
    const foldersRef = doc(db, "folders", wordSet.id_folder);
    await updateDoc(foldersRef, {
        word_sets: arrayUnion(foldersRef, wordSetRef)
    });
    
}

export const getWordSets = async (id_folder: string | undefined) => {
    if (!id_folder) throw new Error("Folder id is not provided");

    const wordSets: WordSetType[] = [];

    const q = query(collection(db, "wordSets"), where("id_folder", "==", id_folder));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        wordSets.push({
            id_word_set: doc.id,
            id_folder: data.id_folder,
            name: data.name,
            visibility: data.visibility,
            createAt: data.createAt,
            modifiedAt: data.modifiedAt,
            words: data.words,
        });
    });

    return wordSets;

}


export const onSnapshotWordSets = (id_folder: string | undefined, callback: (wordSets: WordSetType[]) => void) => {
    if (!id_folder) throw new Error("Folder id is not provided");

    const q = query(collection(db, "wordSets"), where("id_folder", "==", id_folder));
    return onSnapshot(q, (querySnapshot) => {
        const wordSets: WordSetType[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            wordSets.push({
                id_word_set: doc.id,
                id_folder: data.id_folder,
                name: data.name,
                visibility: data.visibility,
                createAt: data.createAt,
                modifiedAt: data.modifiedAt,
                words: data.words,
            });
        });
        callback(wordSets);
    });
}