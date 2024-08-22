import { collection, doc, getDoc, query } from "firebase/firestore";
import { auth, db } from "./firebase-config";

export const addWord = async (word: WordType) => {
    const user = auth.currentUser;
    if (!user) throw new Error("User is not logged in");

    const docRef = doc(db, "words", "wordId");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
    }
}