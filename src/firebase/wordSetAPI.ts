import { addDoc, collection } from "firebase/firestore";
import { WordSetType } from "../types/WordSetType";
import { auth, db } from "./firebase-config";

export const addWordSet = async (wordSet: WordSetType) => {
    const user = auth.currentUser;
    if (!user) throw new Error("User is not logged in");

    const collectionRef = collection(db, "wordSets");
    await addDoc(collectionRef, wordSet);
}


