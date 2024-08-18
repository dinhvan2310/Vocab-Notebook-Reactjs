import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import FolderType from "../types/FolderType"
import { db } from "./firebase-config"

export const addFolder = async (folder: FolderType) => {
    console.log(folder);
    const collectionRef = collection(db, "folders");
    await addDoc(collectionRef, folder);
}

export const getFolders = async (id_user: string) => {
    const collectionRef = collection(db, "folders");
    const q = query(collectionRef, where("id_user", "==", id_user));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data());
}