import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import FolderType from "../types/FolderType"
import { db, auth } from "./firebase-config"

export const addFolder = async (folder: FolderType) => {
    const collectionRef = collection(db, "folders");
    await addDoc(collectionRef, folder);
}

export const removeFolder = async (id_folder: string) => {
    const user = auth.currentUser;
    const docRef = await getDoc(doc(db, "folders", id_folder));
    if (docRef.exists()){
        if (docRef.data().id_user === user?.uid) {
            await deleteDoc(doc(db, "folders", id_folder));
        }
    }
}

export const getFolders = async (id_user: string) => {
    const collectionRef = collection(db, "folders");
    const q = query(collectionRef, where("id_user", "==", id_user));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
        const data = doc.data() as FolderType;
        return {
            id_folder: doc.id,
            ...data
        }
    });
}